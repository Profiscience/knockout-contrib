import * as ko from 'knockout'
import { Context, IContext, IRouteConfig } from '@profiscience/knockout-contrib-router'
import { INITIALIZED } from '../model/builders/DataModelConstructorBuilder'
import { ViewModelConstructorBuilder } from '../model/builders/ViewModelConstructorBuilder'

declare module '@profiscience/knockout-contrib-router' {
  // tslint:disable-next-line no-shadowed-variable
  interface IContext {
    component: {
      /**
       * Route viewModel instance
       */
      viewModel?: ViewModelConstructorBuilder
    }
  }

  // tslint:disable-next-line no-shadowed-variable
  interface IRouteConfig {
    /**
     * Component accessor, intended for use with Webpack (with html-loader) for lazy-loading/code-splitting.
     *
     * Example:
     *
     * ```typescript
     *  component: () => ({
     *    template: import('./template.html'),
     *    viewModel: import('./viewModel')
     *  })
     * ```
     */
    component?: LazyComponentAccessor
  }
}

const uniqueComponentNames = (function*() {
  let i = 0
  while (true) {
    const id = `__router_view_${i++}__`
    if (ko.components.isRegistered(id)) continue
    yield id
  }
})()

export type LazyComponentAccessor = () => ILazyComponent

interface IRoutedComponentConfig {
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

export function componentPlugin({ component: componentAccessor }: IRouteConfig) {
  return function*(ctx: Context & IContext): IterableIterator<void> {
    if (!componentAccessor) return

    const component = componentAccessor()

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
          ctx.component.viewModel = instance
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

async function fetchComponent(accessor: ILazyComponent): Promise<IRoutedComponentConfig> {
  const component: IRoutedComponentConfig = {} as IRoutedComponentConfig

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
