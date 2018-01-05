import * as ko from 'knockout'
import { Context, IContext, IRouteConfig, Middleware } from '@profiscience/knockout-contrib-router'

declare module '@profiscience/knockout-contrib-router' {
  // tslint:disable-next-line no-shadowed-variable
  interface IRouteConfig {
    /**
     * Route-specific components.
     *
     * Will only be registered for the duration of the route.
     *
     * Intended for use with Webpack (with html-loader) for lazy-loading/code-splitting.
     *
     * Example:
     *
     * ```typescript
     *  // in route config
     *  components: () => ({
     *    'my-component-name': import('./my-component')
     *  })
     *
     *  // my-component/index.ts
     *  export { viewModel } from './viewModel'
     *  export { template } from './template.html'
     * ```
     */
    components?(): {
      [k: string]: Promise<KnockoutComponentTypes.Config>
    }
  }
}

export function componentsPlugin({ components: componentsAccessor }: IRouteConfig): Middleware {
  return function*(ctx: Context & IContext): IterableIterator<void> {
    if (!componentsAccessor) return

    /* beforeRender */
    const componentNames: string[] = []
    const lazyComponents = componentsAccessor()

    Object
      .keys(lazyComponents)
      .forEach((componentName) =>  {
        componentNames.push(componentName)
        ctx.queue(lazyComponents[componentName].then((componentConfig: KnockoutComponentTypes.Config) => {
          ko.components.register(componentName, componentConfig)
        }))
      })

    yield
    /* afterRender */

    yield
    /* beforeDispose */
    componentNames.forEach((c) => ko.components.unregister(c))
  }
}
