import {
  Context,
  IContext,
  LifecycleMiddleware
} from '@profiscience/knockout-contrib-router'

export function createLoadingMiddleware({
  start,
  end
}: {
  start: (ctx: Context & IContext) => any
  end: (ctx: Context & IContext) => any
}): LifecycleMiddleware {
  let i = 0
  return (ctx: Context & IContext) => ({
    beforeRender() {
      if (i++ === 0) start(ctx)
    },
    afterRender() {
      if (--i === 0) end(ctx)
    }
  })
}
