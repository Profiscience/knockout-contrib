import {
  Context,
  IContext,
  LifecycleMiddleware
} from '@profiscience/knockout-contrib-router'

let startTime = Date.now()

export function createLoadingMiddleware({
  start,
  end,
  minDuration
}: {
  start: (ctx: Context & IContext) => any
  end: (ctx: Context & IContext) => any
  minDuration?: number
}): LifecycleMiddleware {
  let i = 0
  return (ctx: Context & IContext) => ({
    beforeRender() {
      if (i++ === 0) {
        startTime = Date.now()
        start(ctx)
      }
    },
    afterRender() {
      if (--i === 0) {
        if (minDuration) {
          const elapsed = Date.now() - startTime
          const delay = minDuration - elapsed
          // negative delay will be called immediately
          setTimeout(() => end(ctx), delay)
        } else {
          end(ctx)
        }
      }
    }
  })
}
