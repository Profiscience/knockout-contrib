import { Context, IContext, Middleware } from '@profiscience/knockout-contrib-router'

export function createTitleMiddleware(title: string | ((ctx: Context & IContext) => string)): Middleware {
  return function*(ctx: Context & IContext): IterableIterator<void> {
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
