import * as ko from 'knockout'
import { Context, IContext, IRouteConfig } from '@profiscience/knockout-contrib-router'

type MaybePromise<T> = T | Promise<T>
type MaybeDefaultExport<T> = T | { default: T }
type MaybeAccessor<A, T> = T | ((A) => T)

declare module '@profiscience/knockout-contrib-router' {
  // tslint:disable-next-line no-shadowed-variable
  interface IContext {
    component: MaybePromise<IRoutedComponentInstance>
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
    component?: IRouteComponentConfig
  }
}

export interface IRoutedComponentInstance {
  /**
   * Route viewModel instance
   */
  viewModel?: any
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
export type IRouteComponentConfig =
  | MaybeAccessor<Context & IContext, MaybePromise<string>>
  | MaybeAccessor<Context & IContext, MaybePromise<MaybeLazy<IAnonymousComponent>>>

export type MaybeLazy<T extends {}> = MaybePromise<{
  [P in keyof T]: MaybePromise<MaybeDefaultExport<T[P]>>
}>

export type IAnonymousComponent = {
  template: string
  viewModel?: IRoutedViewModelConstructor
}

/**
 * View model class
 *
 * Accepts router context as first and only argument in constructor
 *
 * See @profiscience/knockout-contrib-router for context API
 */
export interface IRoutedViewModelConstructor {
  new(ctx: Context & IContext): any
}

const uniqueComponentNames = (function*() {
  let i = 0
  while (true) {
    yield `__router_view_${i++}__`
  }
})()

export function componentPlugin({ component: componentAccessor }: IRouteConfig) {
  const componentName = uniqueComponentNames.next().value
  let viewModelInstance: any

  return function*(ctx: Context & IContext): IterableIterator<void> {
    if (!componentAccessor) return

    function initializeComponent(componentConfig: IRoutedComponentConfig) {
      if (componentConfig.viewModel) {
        try {
          viewModelInstance = new (componentConfig.viewModel as any)(ctx)
          ctx.component = { viewModel: viewModelInstance }
          ko.components.register(componentName, {
            synchronous: true,
            ...componentConfig,
            viewModel: { instance: viewModelInstance }
          })
        } catch (e) {
          // tslint:disable-next-line no-console max-line-length
          console.warn('[@profiscience/knockout-contrib-router-plugins-component] Unable to instantiate viewModel. This may cause unexpected behavior. See note about anonymous vs named components in documentation.')
          ctx.component = componentConfig
          ko.components.register(componentName, componentConfig)
        }
      } else {
        ctx.component = {}
        ko.components.register(componentName, {
          synchronous: true,
          ...componentConfig
        })
      }
      return ctx.component
    }

    ctx.route.component = componentName

    /* beforeRender */
    ctx.queue(
      normalizeConfig(ctx, routeConfig.component)
        .then((normalizedConfig) => {
          if (isNamedComponent(normalizedConfig)) {

          } else {
            initializeComponent(normalizedConfig)
          }
        })
    )
    if (typeof componentAccessor === 'function') {
      const p = fetchComponent(componentAccessor(ctx)).then(initializeComponent)
      ctx.component = p
      ctx.queue(p.then(() => {/* noop */}))
    } else if (typeof (componentAccessor as any).name === 'string') {
      let params: any = (componentAccessor as any).params || {}
      if (typeof (componentAccessor as any).params === 'function') {
        params = (componentAccessor as any).params(ctx)
      }
      ko.components.register(componentName, {
        synchronous: true,
        template: '<div data-bind="component: { name: name, params: params }"></div>',
        viewModel: {
          instance: {
            name: (componentAccessor as any).name,
            params
          }
        }
      })
    } else {
      initializeComponent(componentAccessor as IRoutedComponentConfig)
    }

    yield
    /* afterRender */

    ko.components.unregister(componentName)

    yield
    /* beforeDispose */
    if (viewModelInstance && viewModelInstance.dispose) {
      viewModelInstance.dispose()
      viewModelInstance.dispose = () => { /* noop */ }
    }
  }
}

async function normalizeConfig<T>(ctx: Context & IContext, obj: IRouteComponentConfig): Promise<{
  template: NodeList
  viewModel: IRoutedViewModelConstructor
}> {
  // resolve accessors and top-level promise
  if (typeof obj === 'function') obj = await obj(ctx)

  // named components
  if (typeof obj === 'string') {
    return await new Promise((resolve) => ko.components.get(obj as string, resolve)) as any
  }

  // anonymous components, may have promised values
  const ret: T = {} as any
  await Promise.all(
    Object
      .keys(obj)
      .map(async (k) => {
        const v = await ret[k]
        // support dynamic default imports OOTB (i.e. viewModel: import('./viewModel'))
        ret[k] = typeof v.default !== 'undefined'
          ? v.default
          : v
      })
  )
  return ret
}
