import * as ko from 'knockout'
import { Context, IContext, NormalizedRouteConfig } from '@profiscience/knockout-contrib-router'
import { INITIALIZED } from './model/builders/DataModelConstructorBuilder'
import { ViewModelConstructorBuilder } from './model/builders/ViewModelConstructorBuilder'

export const STATE = Symbol('STATE')

export interface IComponentConfig {
  template: string
  viewModel?: { new(ctx: Context & IContext): ViewModelConstructorBuilder }
  synchronous?: true
}

export interface IComponentConfigAccessor {
  [k: string]: undefined | Promise<{ default: string | { new(ctx: Context & IContext): ViewModelConstructorBuilder } }>

  template: Promise<{ default: string }>
  viewModel?: Promise<{ default: { new(ctx: Context & IContext): ViewModelConstructorBuilder } }>
}

export interface IRouteConfig {
  state?: string
  title?: string | (() => string | Promise<string>)
  component?(): IComponentConfigAccessor
  children?: Route[]
  with?: { [k: string]: any }
}

export class Route {
  [path: string]: NormalizedRouteConfig[]

  constructor(path: string, r: IRouteConfig) {
    const normalizedConfig: NormalizedRouteConfig[] = []

    if (r.title) {
      normalizedConfig.push(createTitleMiddleware(r.title))
    }
    if (r.children) {
      normalizedConfig.push(Object.assign({}, ...r.children))
    }
    if (r.with) {
      normalizedConfig.push((ctx: Context) => Object.assign(ctx, r.with))
    }
    if (r.component) {
      normalizedConfig.push(createComponentMiddleware(r.component()))
    }

    this[path] = normalizedConfig

    // this is only used for meta-programming in tests for the moment
    if (r.state) {
      (this[path] as any)[STATE] = r.state
    }
  }
}

function createTitleMiddleware(title: string | (() => string | Promise<string>)) {
  return function*(ctx: Context): IterableIterator<void> {
    /* beforeRender */
    const prevTitle = document.title

    yield
    /* afterRender */

    if (typeof title === 'function') {
      const v = title()
      if (typeof ((v as Promise<string>).then) === 'function') {
        ctx.queue((v as Promise<string>).then((resolvedV: string) => {
          document.title = resolvedV
        }))
      } else {
        document.title = v as string
      }
    } else {
      document.title = title as string
    }

    yield
    /* beforeDispose */

    yield
    /* afterDispose */

    document.title = prevTitle
  }
}

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

function createComponentMiddleware(component: IComponentConfigAccessor) {
  return function*(ctx: Context): IterableIterator<void> {
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

async function fetchComponent(accessor: IComponentConfigAccessor): Promise<IComponentConfig> {
  const component: IComponentConfig = {} as IComponentConfig

  const promises = Object
    .keys(accessor)
    .map(async (k) => {
      component[k as 'template' | 'viewModel'] = ((await accessor[k]) as any).default
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
