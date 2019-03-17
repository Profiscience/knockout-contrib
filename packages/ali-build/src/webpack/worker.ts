import { throttle } from 'lodash'
import { Observable } from 'rxjs'
import webpack from 'webpack'
import { createWebpackConfig } from './config'
import { IWebpackBuildEvent } from './'

const opts = JSON.parse(process.argv[2])

const config = createWebpackConfig(opts)

let prevMessage: string

const proc = new Observable((observer) => {
  const updateStatus = throttle((percentage, message) => {
    if (
      percentage === 1 ||
      (process.env.LOG_PROGRESS === 'false' && message === prevMessage)
    ) {
      return
    }
    prevMessage = message
    observer.next({
      status: {
        percentage,
        message
      }
    })
  }, 200)

  if (config.plugins) {
    config.plugins.push(new webpack.ProgressPlugin(updateStatus))
  }

  const compiler = webpack(config)

  async function onRunComplete(err: Error, stats: webpack.Stats) {
    observer.next({
      complete: true,
      stats: stats.toJson(),
      error: err
    })
  }

  if (opts.watch) {
    compiler.watch({}, onRunComplete)
  } else {
    compiler.run(onRunComplete)
  }
})

if (process.send) {
  const send = process.send.bind(process)
  if (opts.watch && process.send) {
    proc.forEach((e: IWebpackBuildEvent) => {
      if (e.status) {
        send({
          status: 'working',
          message: e.status.message,
          percentage: e.status.percentage
        })
      } else if (e.error) {
        send({
          status: 'error',
          message: e.error
        })
      } else if (e.complete) {
        send({
          status: 'ok',
          stats: e.stats
        })
      }
    })
  } else {
    proc.forEach((e: IWebpackBuildEvent) => send(e))
  }
}
