import { Context, IContext } from '@profiscience/knockout-contrib-router'

export type ScrollPositionMiddlewareOpts = {
  scrollTo?(x: number, y: number): void
}

export function createScrollPositionMiddleware(opts: ScrollPositionMiddlewareOpts = {}) {
  const scrollTo = opts.scrollTo || window.scrollTo

  return function*(ctx: Context & IContext) {
    const hash = (location.pathname + location.hash)
      .replace(/#!/, '')
      .replace(/^[^#]+#?/, '')

    yield

    let y = 0

    if (history.state && history.state.scrollPosition) {
      y = history.state.scrollPosition
    } else if (hash) {
      const anchor = document.getElementById(hash)
      if (anchor !== null) {
        y = anchor.offsetTop
      } else {
        // tslint:disable-next-line no-console
        console.warn(
          '[@profiscience/knockout-contrib-middleware-scroll-position]',
          `Navigated to page with #${hash}, but no element with id ${hash} found.`
        )
      }
    }

    scrollTo(0, y)

    yield

    history.replaceState({
      ...(history.state || {}),
      scrollPosition: window.scrollY
    }, document.title)
  }
}
