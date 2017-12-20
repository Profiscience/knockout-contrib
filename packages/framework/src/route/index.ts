import * as ko from 'knockout'
import { Context, IContext, NormalizedRouteConfig } from '@profiscience/knockout-contrib-router'
import { createComponentMiddleware, ILazyComponent } from './component'
import { createTitleMiddleware } from './title'

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
  title?: string | ((ctx: Context & IContext) => string)
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

  constructor(path: string, config: IRouteConfig) {
    const normalizedConfig: NormalizedRouteConfig[] = []

    if (config.title) {
      normalizedConfig.push(createTitleMiddleware(config.title))
    }
    if (config.children) {
      normalizedConfig.push(Object.assign({}, ...config.children))
    }
    if (config.with) {
      normalizedConfig.push((ctx: Context) => Object.assign(ctx, config.with))
    }
    if (config.component) {
      normalizedConfig.push(createComponentMiddleware(config.component))
    }

    this[path] = normalizedConfig

    // this is only used for meta-programming in tests for the moment
    if (config.state) {
      (this[path] as any)[STATE] = config.state
    }
  }
}
