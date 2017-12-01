import * as ko from 'knockout'
import { Context, IContext, NormalizedRouteConfig } from '@profiscience/knockout-contrib-router'
import { INITIALIZED } from './model/builders/DataModelConstructorBuilder'
import { ViewModelConstructorBuilder } from './model/builders/ViewModelConstructorBuilder'

/**
 * Symbol to access state name on route. Requires casting as any in TypeScript due to symbol key limitations.
 *
 * Currently only used for metaprogramming in UniversitySite, namely generating E2E state definitions.
 *
 * Example:
 *
 * ```typescript
 *  import { Route, STATE } from '@profiscience/framework'
 *
 *  const route = new Route('/', { state: 'home' })
 *
 *  route['/'][STATE] === 'home'
 * ```
 */
export const STATE = Symbol('STATE')

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
 */
export interface ILazyComponent {
  template: Promise<{ default: string }>
  viewModel?: Promise<{ default: IRoutedViewModelConstructor }>
}

export interface IRouteConfig {
  /**
   * State name, currently only used for metaprogramming. Accessed with exported STATE symbol.
   *
   * Example:
   *
   * ```typescript
   *  import { Route, STATE } from '@profiscience/framework'
   *
   *  const route = new Route('/', { state: 'home' })
   *
   *  route['/'][STATE] === 'home'
   * ```
   */
  state?: string
  /**
   * Document title for view, can be async or sync accessor function
   */
  title?: string | (() => string | Promise<string>)
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
  component?(): ILazyComponent
  /**
   * Nested routes
   */
  children?: Route[]
  /**
   * Additional data to extend context with.
   *
   * Can be used for overriding url params, e.g.
   *
   * ```typescript
   *  with: { params: { id: 0 } }
   * ```
   */
  with?: { [k: string]: any }
}

/**
 * Creates a new route consumable by @profiscience/knockout-contrib-router.
 *
 * For convenience, Router is re-exported from @profiscience/knockout-contrib-router.
 *
 * Example:
 *
 * ```typescript
 *  import { Route, Router } from '@profiscience/framework'
 *
 *  const routes = [
 *    new Route('/', { state: 'home', component: ... }),
 *    new Route('/users', {
 *      state: 'user',
 *      children: [
 *        new Route('/', { state: 'list', component: ... }),
 *        new Route('/:id', { state: 'show', component: ... })
 *      ]
 *    })
 *  ]
 * ```
 *
 * For all available properties, see IRouteConfig
 */
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

function createComponentMiddleware(component: ILazyComponent) {
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
