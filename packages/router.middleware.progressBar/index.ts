import { ToProgress, ToProgressOptions } from 'toprogress2'
import { LifecycleMiddleware } from '@profiscience/knockout-contrib-router'
import { createLoadingMiddleware } from '@profiscience/knockout-contrib-router-middleware-loading'

export function createProgressBarMiddleware(
  opts?: ToProgressOptions
): LifecycleMiddleware {
  const progressBar = new ToProgress(opts)

  return createLoadingMiddleware({
    start: () =>
      progressBar.start().catch(() => {
        /* noop */
      }),
    end: () =>
      progressBar.finish().catch(() => {
        /* noop */
      })
  })
}
