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
    component?: LazyComponentAccessor | IRoutedComponentConfig
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
export interface ILazyComponent {
  template: Promise<{ default: string }>
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
    const id = `__router_view_${i++}__`
    if (ko.components.isRegistered(id)) continue
    yield id
  }
})()

export function componentPlugin({ component: componentAccessor }: IRouteConfig) {
  return function*(ctx: Context & IContext): IterableIterator<void> {
    if (!componentAccessor) return

    function initializeComponent(componentConfig: IRoutedComponentConfig) {
      if (componentConfig.viewModel) {
        try {
          const instance = new (componentConfig.viewModel as any)(ctx)
          ctx.component = { viewModel: instance }
          ko.components.register(ctx.route.component, {
            synchronous: true,
            template: componentConfig.template,
            viewModel: { instance }
          })
        } catch (e) {
          // tslint:disable-next-line no-console max-line-length
          console.warn('[@profiscience/knockout-contrib-router-plugins-component] Unable to `new` viewModel. This may cause unexpected behavior.')
          ctx.component = componentConfig
          ko.components.register(ctx.route.component, componentConfig)
        }
      }
      return ctx.component
    }

    ctx.route.component = uniqueComponentNames.next().value

    /* beforeRender */

    if (typeof componentAccessor === 'function') {
      const p = fetchComponent(componentAccessor()).then(initializeComponent)
      ctx.component = p
      ctx.queue(p.then(() => {/* noop */}))
    } else {
      initializeComponent(componentAccessor)
    }

    yield
    /* afterRender */

    ko.components.unregister(ctx.route.component)
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
