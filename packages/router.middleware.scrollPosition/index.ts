import {
  Context,
  IContext,
  LifecycleMiddleware
} from '@profiscience/knockout-contrib-router'

export type ScrollPositionMiddlewareOpts = {
  scrollTo?(x: number, y: number): void
}

export function createScrollPositionMiddleware(
  opts: ScrollPositionMiddlewareOpts = {}
): LifecycleMiddleware {
  const scrollTo = opts.scrollTo || window.scrollTo

  return (ctx: Context & IContext) => ({
    afterRender() {
      const hash = (location.pathname + location.hash)
        .replace(/#!/, '')
        .replace(/^[^#]+#?/, '')
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
    },
    beforeDispose() {
      history.replaceState(
        {
          ...(history.state || {}),
          scrollPosition: window.scrollY
        },
        document.title
      )
    }
  })
}
