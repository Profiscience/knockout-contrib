import { Context } from '@profiscience/knockout-contrib-router'

export function createTitleMiddleware(title: string | (() => string | Promise<string>)) {
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
