import * as ko from 'knockout'
import { ToProgress, ToProgressOptions } from 'toprogress2'
import { Context, IContext } from '@profiscience/knockout-contrib-router'

export function createProgressBarMiddleware(opts?: ToProgressOptions) {
  const progressBar = new ToProgress(opts)

  return function* progressBarMiddleware(ctx: Context & IContext) {
    if (ctx.router.isRoot) progressBar.start().catch(/* istanbul ignore next */() => ({}))
    yield
    if (!ctx.$child) progressBar.finish().catch(/* istanbul ignore next */() => ({}))
  }
}
