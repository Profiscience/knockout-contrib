import * as ko from 'knockout'
import { Context, IContext, IRouteConfig } from '@profiscience/knockout-contrib-router'
import { LifecycleGeneratorMiddleware } from '../router/src/router'

let UNINSTANTIABLE_VIEWMODEL_WARNING_ENABLED = true

type MaybePromise<T> = T | Promise<T>
type MaybeDefaultExport<T> = T | { default: T }
type MaybeAccessor<A, T> = T | ((arg: A) => T)

declare module '@profiscience/knockout-contrib-router' {
  interface IContext {
    component?: MaybePromise<IRoutedComponentInstance>
  }

  interface IRouteConfig {
    /**
     * Component accessor, intended for use with dynamic imports for lazy-loading.
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
    component?: IRouteComponentConfig
  }
}

export interface IRoutedComponentInstance {
  /**
   * Name component is registered with Knockout as
   */
  name: string
  /**
   * Route viewModel instance
   */
  viewModel?: any
}

/**
 * Intended for use with dynamic imports for lazy-loading/code-splitting
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
export type IRouteComponentConfig =
  | MaybeAccessor<Context & IContext, MaybePromise<INamedComponent>>
  | MaybeAccessor<Context & IContext, MaybePromise<MaybeLazy<IAnonymousComponent>>>

export type MaybeLazy<T extends {}> = MaybePromise<{
  [P in keyof T]: MaybePromise<MaybeDefaultExport<T[P]>>
}>

export type INamedComponent = string

export type IAnonymousComponent = {
  template: string
  name?: string
  viewModel?: IRoutedViewModelConstructor
}

/**
 * ViewModel Class
 *
 * Constructor accepts route context as first and only argument
 *
 * See @profiscience/knockout-contrib-router for context API
 */
export interface IRoutedViewModelConstructor {
  new(ctx: Context & IContext): any
}

const uniqueComponentNames = (function*() {
  let i = 0
  while (true) yield `__router_view_${i++}__`
})()

// @TODO (try to) make this type-safe, i.e. know it's void if routeConfig.component is void, and middleware if not
export function componentPlugin({ component: componentAccessor }: IRouteConfig): void | LifecycleGeneratorMiddleware {
  if (!componentAccessor) return

  let componentName: string

  return function*(ctx) {
    let viewModelInstance: any
    let resolveComponent: (componentInstance: IRoutedComponentInstance) => void
    ctx.component = new Promise((_resolve) => resolveComponent = _resolve)

    ctx.queue(
      normalizeConfig(ctx, componentAccessor)
        .then(async (normalizedConfig) => {
          // named component
          if (typeof normalizedConfig === 'string') {
            componentName = normalizedConfig
            resolveComponent({ name: componentName })
            if (UNINSTANTIABLE_VIEWMODEL_WARNING_ENABLED) console.warn('[@profiscience/knockout-contrib-router-plugins-component] Unable to instantiate viewModel when using named components. This may cause unexpected behavior. View "Subtleties/Caveats" in the documentation.') // tslint:disable-line max-line-length no-console
          // anonymous component
          } else {
            componentName = normalizedConfig.name || uniqueComponentNames.next().value

            const routedComponentInstance: IRoutedComponentInstance = { name: componentName }
            const templateConfig = normalizedConfig.template
            let viewModelConfig: any

            if (normalizedConfig.viewModel) {
              try {
                viewModelInstance = new normalizedConfig.viewModel(ctx)
                viewModelConfig = { instance: viewModelInstance }
                routedComponentInstance.viewModel = viewModelInstance
              } catch (e) {
                viewModelConfig = normalizedConfig.viewModel
                if (UNINSTANTIABLE_VIEWMODEL_WARNING_ENABLED) console.warn('[@profiscience/knockout-contrib-router-plugins-component] Unable to instantiate viewModel using `new`. This may cause unexpected behavior. See "Subtleties/Caveats" in the documentation.') // tslint:disable-line no-console max-line-length
              }
            }

            resolveComponent(routedComponentInstance)
            ctx.component = routedComponentInstance

            ko.components.register(componentName, {
              synchronous: true,
              template: templateConfig,
              viewModel: viewModelConfig
            })
          }

          ctx.route.component = componentName
        })
    )

    yield // afterRender

    ko.components.unregister(ctx.route.component)
  }
}

export function disableUninstantiableViewModelWarning() {
  UNINSTANTIABLE_VIEWMODEL_WARNING_ENABLED = false
}

async function normalizeConfig(
  ctx: Context & IContext,
  obj: IRouteComponentConfig
): Promise<INamedComponent | IAnonymousComponent> {
  // resolve accessors
  if (typeof obj === 'function') obj = obj(ctx)

  // resolve top-level promises
  obj = await obj

  // named components
  if (typeof obj === 'string') return obj

  // anonymous components, may have promised values
  const ret = {} as any
  await Promise.all(
    Object
      .keys(obj)
      .map(async (k) => {
        const v = await (obj as any)[k]
        // support dynamic default imports OOTB (i.e. viewModel: import('./viewModel'))
        ret[k] = typeof v.default !== 'undefined' ? v.default : v
      })
  )

  return ret
}
