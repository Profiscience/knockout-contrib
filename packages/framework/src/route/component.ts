import * as ko from 'knockout'
import { Context, IContext } from '@profiscience/knockout-contrib-router'
import { INITIALIZED } from '../model/builders/DataModelConstructorBuilder'
import { ViewModelConstructorBuilder } from '../model/builders/ViewModelConstructorBuilder'

const uniqueComponentNames = (function*() {
  let i = 0
  while (true) {
    const id = `__router_view_${i++}__`
    if (ko.components.isRegistered(id)) {
      continue
    }
    yield id
  }
})()

interface IComponentConfig {
  template: string

  viewModel?: { new(ctx: Context & IContext): ViewModelConstructorBuilder }
  synchronous?: true
}

/**
 * View model class
 *
 * Accepts router context as first and only argument in constructor
 *
 * See @profiscience/knockout-contrib-router for context API
 */
export interface IRoutedViewModelConstructor {
  new(ctx: Context & IContext): ViewModelConstructorBuilder
}

/**
 * Intended for use with Webpack (with html-loader) for lazy-loading/code-splitting
 *
 * Example:
 *
 * ```typescript
 *  {
 *    template: import('./template.html'),
 *    viewModel: import('./viewModel')
 *  }
 * ```
 */
export interface ILazyComponent {
  template: Promise<{ default: string }>
  viewModel?: Promise<{ default: IRoutedViewModelConstructor }>
}

export function createComponentMiddleware(getComponent: () => ILazyComponent) {
  return function*(ctx: Context): IterableIterator<void> {
    const component = getComponent()

    /* beforeRender */
    const componentName = uniqueComponentNames.next().value

    ctx.route.component = componentName

    const initializeComponentPromise = fetchComponent(component)
      // tslint:disable-next-line variable-name
      .then(async ({ template, viewModel: ViewModel }) => {
        const componentConfig: KnockoutComponentTypes.Config = {
          synchronous: true,
          template
        }

        if (ViewModel) {
          const instance = new ViewModel(ctx)
          await initializeViewModel(instance)
          componentConfig.viewModel = {
            instance
          }
        }

        componentConfig.synchronous = true
        ko.components.register(componentName, componentConfig)
      })

    ctx.queue(initializeComponentPromise)

    yield
    /* afterRender */

    ko.components.unregister(componentName)
  }
}

async function fetchComponent(accessor: ILazyComponent): Promise<IComponentConfig> {
  const component: IComponentConfig = {} as IComponentConfig

  const promises = Object
    .keys(accessor)
    .map(async (k) => {
      component[k as 'template' | 'viewModel'] = ((await (accessor as any)[k]) as any).default
    })

  await Promise.all(promises)

  return component
}

async function initializeViewModel(vm: ViewModelConstructorBuilder) {
  await Promise.all(
    Object
      .keys(vm)
      .filter((prop: any) => (vm as any)[prop][INITIALIZED])
      .map(async (dataModelProp: any) => await (vm as any)[dataModelProp][INITIALIZED])
  )
}
