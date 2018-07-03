import { ToProgress, ToProgressOptions } from 'toprogress2'
import {
  Context,
  IContext,
  LifecycleMiddleware
} from '@profiscience/knockout-contrib-router'

export function createProgressBarMiddleware(
  opts?: ToProgressOptions
): LifecycleMiddleware {
  const progressBar = new ToProgress(opts)
  let i = 0

  return (ctx: Context & IContext) => ({
    beforeRender() {
      if (i === 0) {
        progressBar.start().catch(/* istanbul ignore next */ () => ({}))
      }
      i++
    },
    afterRender() {
      i--
      if (i === 0) {
        progressBar.finish().catch(/* istanbul ignore next */ () => ({}))
      }
    }
  })
}
