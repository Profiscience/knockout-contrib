import { Context } from '@profiscience/knockout-contrib-router'

const TITLE_SET = Symbol('TITLE_SET')

export function createTitleMiddleware(title: string | (() => string)) {
  return function*(ctx: Context): IterableIterator<void> {
    /* beforeRender */
    const prevTitle = document.title

    yield
    /* afterRender */

    if (typeof title === 'function') {
      document.title = title()
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
