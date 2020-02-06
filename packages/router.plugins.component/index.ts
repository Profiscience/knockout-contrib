import * as ko from 'knockout'
import {
  Context,
  IContext,
  IRouteConfig,
  LifecycleMiddleware
} from '@profiscience/knockout-contrib-router'

let UNINSTANTIABLE_VIEWMODEL_WARNING_ENABLED = true

type Accessor<A, T> = (arg: A) => T
type DefaultExport<T> = { default: T; __esModule: true }
type MaybePromise<T> = T | Promise<T>
type MaybeDefaultExport<T> = T | DefaultExport<T>
type MaybeAccessor<A, T> = T | Accessor<A, T>

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
  viewModel?: ko.components.ViewModel
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
export type IRouteComponentConfig = MaybeAccessor<
  Context & IContext,
  MaybePromise<
    MaybeDefaultExport<INamedComponent | MaybeLazy<IAnonymousComponent>>
  >
>

export type MaybeLazy<T extends {}> = MaybePromise<
  { [P in keyof T]: MaybePromise<MaybeDefaultExport<T[P]>> }
>

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
export type IRoutedViewModelConstructor = new (
  ctx: Context & IContext
) => ko.components.ViewModel

const uniqueComponentNames = (function*() {
  let i = 0
  while (true) yield `__router_view_${i++}__`
})()

export function componentRoutePlugin(routeConfig: {
  component?: undefined
}): void
export function componentRoutePlugin(routeConfig: {
  component: IRouteComponentConfig
}): LifecycleMiddleware
export function componentRoutePlugin({
  component: componentAccessor
}: IRouteConfig): void | LifecycleMiddleware {
  if (!componentAccessor) return

  return (ctx) => {
    let isNamedComponent: boolean

    return {
      beforeRender() {
        let _resolve: (c: IRoutedComponentInstance) => void
        const resolveComponent = (
          name: string,
          instance?: IRoutedComponentInstance
        ): void => {
          const c = {
            name,
            ...(instance || {})
          }
          ctx.route.component = name
          ctx.component = c
          _resolve(c)
        }
        let viewModelInstance: ko.components.ViewModel
        ctx.component = new Promise((r) => (_resolve = r))

        ctx.queue(
          normalizeConfig(ctx, componentAccessor).then((normalizedConfig) => {
            // named component
            if (typeof normalizedConfig === 'string') {
              isNamedComponent = true
              resolveComponent(normalizedConfig)
              if (UNINSTANTIABLE_VIEWMODEL_WARNING_ENABLED) {
                console.warn(
                  '[@profiscience/knockout-contrib-router-plugins-component] Unable to instantiate viewModel when using named components. This may cause unexpected behavior. View "Subtleties/Caveats" in the documentation.'
                )
              }
            } else {
              // anonymous component
              const componentName =
                normalizedConfig.name || uniqueComponentNames.next().value

              const routedComponentInstance: IRoutedComponentInstance = {
                name: componentName
              }
              const templateConfig = normalizedConfig.template
              let viewModelConfig: ko.components.ViewModelConfig | undefined

              if (normalizedConfig.viewModel) {
                try {
                  viewModelInstance = new normalizedConfig.viewModel(ctx)
                  viewModelConfig = { instance: viewModelInstance }
                  routedComponentInstance.viewModel = viewModelInstance
                } catch (e) {
                  viewModelConfig = normalizedConfig.viewModel as ko.components.ViewModelConfig
                  if (UNINSTANTIABLE_VIEWMODEL_WARNING_ENABLED) {
                    console.warn(
                      '[@profiscience/knockout-contrib-router-plugins-component] Unable to instantiate viewModel using `new`. This may cause unexpected behavior. See "Subtleties/Caveats" in the documentation.'
                    )
                  }
                }
              }

              resolveComponent(componentName, routedComponentInstance)

              ko.components.register(componentName, {
                synchronous: true,
                template: templateConfig,
                viewModel: viewModelConfig
              })
            }
          })
        )
      },
      afterRender() {
        if (!isNamedComponent) {
          ko.components.unregister(ctx.route.component)
        }
      },
      beforeDispose() {
        if (!isNamedComponent && ctx.component) {
          const c = ctx.component as IRoutedComponentInstance
          if (c.viewModel && c.viewModel.dispose) {
            c.viewModel.dispose()
            c.viewModel.dispose = () => {
              /* noop */
            }
          }
        }
      }
    }
  }
}

export function disableUninstantiableViewModelWarning(): void {
  UNINSTANTIABLE_VIEWMODEL_WARNING_ENABLED = false
}

async function normalizeConfig(
  ctx: Context & IContext,
  maybeAccessor: IRouteComponentConfig
): Promise<INamedComponent | IAnonymousComponent> {
  // one day...
  // const obj = resolveAccessor(maybeAccessor, ctx) |> resolvePromise |> resolveDefaultExport

  const obj = await resolveDefaultExport(
    await resolvePromise(resolveAccessor(maybeAccessor, ctx))
  )

  // named components
  if (typeof obj === 'string') return obj

  // anonymous components, may have promised values
  const ret = {} as IAnonymousComponent
  await Promise.all(
    Object.keys(obj).map(async (k: unknown) => {
      // this is fucking stupid -__-
      ret[k as keyof typeof obj] = resolveDefaultExport(
        await resolvePromise(
          obj[k as keyof typeof obj] as MaybePromise<
            string & IRoutedViewModelConstructor
          >
        )
      )
    })
  )

  return ret
}

function resolveAccessor<T, A>(maybeAccessor: MaybeAccessor<A, T>, arg: A): T {
  return typeof maybeAccessor === 'function'
    ? (maybeAccessor as Accessor<A, T>)(arg)
    : maybeAccessor
}

async function resolvePromise<T>(maybePromise: MaybePromise<T>): Promise<T> {
  return maybePromise
}

function resolveDefaultExport<T>(maybeDefaultExport: MaybeDefaultExport<T>): T {
  return Object.hasOwnProperty.call(maybeDefaultExport, '__esModule')
    ? (maybeDefaultExport as DefaultExport<T>).default
    : (maybeDefaultExport as T)
}
