import { each, map } from 'lodash'
import chalk from 'chalk'
import { format as formatDate } from 'date-fns'
import { arrowRight, cross } from 'figures'
import * as cursor from 'cli-cursor'
import {
  hasErrors,
  isLongRunningTask,
  getStatusMessageForLongRunningTask,
  getStatusMessageForRunOnceTask
} from './raw'

export class VerboseReporter {
  public _tasks: any[]
  private _out: NodeJS.Socket | NodeJS.WritableStream
  private _err: NodeJS.Socket | NodeJS.WritableStream
  private _loggedMessages = new Set<string>()

  constructor(
    tasks: any[],
    outStream: NodeJS.Socket | NodeJS.WritableStream,
    errStream: NodeJS.Socket | NodeJS.WritableStream
  ) {
    this._tasks = tasks
    this._out = outStream
    this._err = errStream

    this.init = this.init.bind(this)
  }

  public render() {
    cursor.hide()
    each(this._tasks, this.init)
  }

  public end(err: Error) {
    if (err) {
      this.logErr(err.message)
    }

    cursor.show()
  }

  private log(
    stream: NodeJS.WritableStream,
    messages: string[],
    color = (v: string) => v
  ) {
    const time = chalk.dim(`[${formatDate(new Date(), 'HH:mm:ss')}] `)
    stream.write(`\n${time} `)
    stream.write(color(map(messages, (m) => m.trim()).join('')))
  }

  private logOut(...messages: string[]) {
    const msg = messages.join('')
    if (this._loggedMessages.has(msg)) return
    this._loggedMessages.add(msg)
    this.log(this._out, messages)
  }

  private logErr(...messages: string[]) {
    this.log(this._err, messages, chalk.red)
  }

  private init(task: any) {
    task.subscribe({
      next: (event: any) => {
        if (event.type === 'SUBTASKS') {
          each(task.subtasks, this.init)
        } else {
          this.logEvent(task, event)
        }
      }
    })
  }

  private logEvent(task: any, event: any) {
    if (event.type === 'STATE') {
      const state = task.isPending() ? 'started' : task.state

      this.logOut(`${task.title} [${state}]`)

      if (task.isSkipped() && task.output) {
        this.logOut(`${arrowRight} ${task.output}`)
      }
    } else if (event.type === 'DATA') {
      if (hasErrors(task)) {
        this.logErr(`${chalk.red(cross)}\n\n${event.data}`)
      } else {
        if (isLongRunningTask(task)) {
          this.logOut(getStatusMessageForLongRunningTask(task))
        } else {
          this.logOut(
            chalk.dim(task.title),
            getStatusMessageForRunOnceTask(task, { progress: false })
          )
        }
      }
    }
  }
}
