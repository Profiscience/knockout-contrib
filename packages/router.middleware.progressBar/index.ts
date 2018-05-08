import { ToProgress, ToProgressOptions } from 'toprogress2'
import { Context, IContext, LifecycleGeneratorMiddleware } from '@profiscience/knockout-contrib-router'

export function createProgressBarMiddleware(opts?: ToProgressOptions): LifecycleGeneratorMiddleware {
  const progressBar = new ToProgress(opts)
  let i = 0

  return function* progressBarMiddleware(ctx: Context & IContext) {
    if (i === 0) progressBar.start().catch(/* istanbul ignore next */() => ({}))
    i++
    yield
    i--
    if (i === 0) progressBar.finish().catch(/* istanbul ignore next */() => ({}))
  }
}
