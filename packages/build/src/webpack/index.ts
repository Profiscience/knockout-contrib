import { fork } from 'child_process'
import * as path from 'path'
import { Observable } from 'rxjs'
import { ILongRunningTaskPayload } from '../task-payload'
import { IWebpackConfigOptions } from './config'

export interface IWebpackBuildStatusEvent {
  percentage: number
  message: string
}

interface IWebpackBuildCompleteEvent {
  complete: true
  stats: any
}

export interface IWebpackBuildEvent {
  error?: string
  stats?: any
  status?: IWebpackBuildStatusEvent
  complete?: boolean
}

export function buildApps(opts: IWebpackConfigOptions) {
  const proc = fork(path.resolve(__dirname, './worker.js'), [
    JSON.stringify(opts)
  ])
  if (opts.watch) {
    return new Observable<ILongRunningTaskPayload>((observer) => {
      proc.on('error', (err) => observer.error(err))
      proc.on('message', (msg: ILongRunningTaskPayload) => observer.next(msg))
    })
  } else {
    return new Observable<
      IWebpackBuildStatusEvent | IWebpackBuildCompleteEvent
    >((observer) => {
      proc.on('error', (err) => observer.error(err))
      proc.on('message', (e: IWebpackBuildEvent) => {
        if (e.status) {
          observer.next(e.status)
        } else if (e.complete) {
          if (e.error) {
            observer.error(new Error(e.error))
          } else if (e.stats.errors.length !== 0) {
            observer.error(new Error(e.stats.errors.join('\n\n\n')))
          } else {
            observer.next({
              complete: true,
              stats: e.stats
            })
            observer.complete()
          }
        }
      })
    })
  }
}
