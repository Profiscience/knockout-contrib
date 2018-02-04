import * as ko from 'knockout'
import { Context, IContext, IRouteConfig } from '@profiscience/knockout-contrib-router'

declare module '@profiscience/knockout-contrib-router' {
  // tslint:disable-next-line no-shadowed-variable
  interface IContext {
    component: Promise<IRoutedComponentInstance> | IRoutedComponentInstance
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
    component?:
      | LazyComponentAccessor
      | IRoutedComponentConfig
      | { name: string, params?: { [k: string]: any } | ((ctx: Context & IContext) => { [k: string]: any }) }
  }
}

export type LazyComponentAccessor = () => ILazyComponent

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
export type ILazyComponent = Promise<{ template: string, viewModel: IRoutedViewModelConstructor }> | {
  template: Promise<string | { default: string }>
  viewModel?: Promise<{ default: IRoutedViewModelConstructor }>
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

export interface IRoutedComponentConfig {
  template: string
  viewModel?: { new(ctx: Context & IContext): any }
  synchronous?: true
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
          console.warn('[@profiscience/knockout-contrib-router-plugins-component] Unable to `new` viewModel. This may cause unexpected behavior.')
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
    if (typeof componentAccessor === 'function') {
      const p = fetchComponent(componentAccessor()).then(initializeComponent)
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

async function fetchComponent(accessor: ILazyComponent): Promise<IRoutedComponentConfig> {
  const component: IRoutedComponentConfig = {} as IRoutedComponentConfig

  if (accessor instanceof Promise) {
    Object.assign(component, await accessor)
  } else {
    const promises = Object
      .keys(accessor)
      .map(async (k) => {
        const imports = await accessor[k]
        if (typeof imports.default !== 'undefined') {
          component[k] = imports.default
        } else {
          component[k] = imports
        }
      })
    await Promise.all(promises)
  }

  return component
}
