import { Context, IContext, IRouteConfig, Middleware } from '@profiscience/knockout-contrib-router'

declare module '@profiscience/knockout-contrib-router' {
  // tslint:disable-next-line no-shadowed-variable
  interface IRouteConfig {
    /**
     * Document title for view, can be async or sync accessor function
     */
    title?: string | ((ctx: Context & IContext) => string)
  }
}

export function titlePlugin({ title }: IRouteConfig): Middleware {
  return function*(ctx: Context & IContext): IterableIterator<void> {
    if (!title) return

    /* beforeRender */
    const prevTitle = document.title

    yield
    /* afterRender */

    if (typeof title === 'function') {
      document.title = title(ctx)
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
