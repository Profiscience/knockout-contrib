import { isString } from 'lodash'
import chalk from 'chalk'
import cliTruncate from 'cli-truncate'
import {
  arrowDown,
  arrowRight,
  bullet,
  cross,
  ellipsis,
  pointer,
  warning,
  tick
} from 'figures'
import indentString from 'indent-string'
import elegantSpinner from 'elegant-spinner'
import { createProgressBar } from '../utils'

export interface IRawOutput {
  output: string[]
  errors: string[]
  warnings: string[]
  working: boolean
}

/**
 * This reporter is most (only?) useful as a base class. See TTY, or the dev server
 */
export abstract class RawReporter {
  public _id?: NodeJS.Timer
  private _tasks: any[]
  private _waiting?: boolean

  constructor(tasks: any[]) {
    this._tasks = tasks
  }

  public render(...args: any[]) {
    if (this._id) {
      // Do not render if we are already rendering
      return
    }
    this._update(...args)
    this._id = setInterval(() => {
      this._update(...args)
    }, 200)
  }

  public end(err: any, ...args: any[]) {
    if (this._id) {
      clearInterval(this._id)
      this._id = undefined
    }
    this._update(...args)
  }

  protected abstract update(output: IRawOutput, ...args: any[]): void

  private _update(...args: any[]) {
    const output = getOutput(this._tasks)
    if (this._waiting && !output.working) {
      return
    }
    this.update(output, ...args)
    this._waiting = !output.working
  }
}

function getOutput(tasks: any[], level = 0): IRawOutput {
  const output = []
  const errors = []
  const warnings = []
  let working = false

  for (const task of tasks) {
    if (task.isEnabled()) {
      const maxWidth = (process.stdout as any).columns - 3
      const symbol = getSymbol(task)
      let line = `${symbol} ${task.title}`

      if (task.isSkipped()) {
        line += getSkippedMessage(task)
        continue
      }

      if (!task.isCompleted() && task.subtasks.length === 0) {
        if (isLongRunningTask(task)) {
          line += getStatusMessageForLongRunningTask(task)
          working = working || task.output.status === 'working'
        } else {
          line += getStatusMessageForRunOnceTask(task)
          if (!hasErrors(task)) {
            working = working || true
          }
        }
      }

      line = cliTruncate(indentString(line, level, '  '), maxWidth, {
        position: 'middle'
      })

      output.push(line)
      errors.push(...getErrors(task))
      warnings.push(...getWarnings(task))

      if (task.subtasks.length !== 0) {
        const subtaskOutput = getOutput(task.subtasks, level + 1)
        errors.push(...subtaskOutput.errors)
        warnings.push(...subtaskOutput.warnings)
        working = working || subtaskOutput.working

        if (task.isPending() || errors.length > 0 || warnings.length > 0) {
          output.push(...subtaskOutput.output)
        }
      }
    }
  }

  return { output, errors, warnings, working }
}

function getSymbol(task: any) {
  if (!task.spinner) {
    task.spinner = elegantSpinner()
  }
  const skip = chalk.dim(arrowDown)
  const success = chalk.green(tick) // run once
  const ok = chalk.green(bullet) // watchers
  const fail = chalk.red(cross)
  const warn = chalk.yellow(warning)
  const working = chalk.yellow(task.spinner())
  const indent = chalk.yellow(pointer)
  const waiting = chalk.dim(ellipsis)

  switch (true) {
    case task.isSkipped():
      return skip
    case hasErrors(task):
      return fail
    case hasWarnings(task):
      return warn
    case task.isPending():
      if (isLongRunningTask(task)) {
        switch (task.output.status) {
          case 'working':
            return working
          case 'ok':
            return ok
        }
      } else {
        return task.subtasks.length > 0 ? indent : working
      }
    case !task.isCompleted():
      return waiting
    default:
      return success
  }
}

export function hasErrors(task: any) {
  return getErrors(task).length > 0
}

export function hasWarnings(task: any) {
  return getWarnings(task).length > 0
}

export function getErrors(task: any) {
  if (task.hasFailed()) {
    return [task.output]
  }
  if (task.output) {
    if (task.output.error) {
      return [task.output.error]
    }
    if (task.output.stats && task.output.stats.errors) {
      return task.output.stats.errors
    }
  }
  return []
}

export function getWarnings(task: any) {
  return task.output && task.output.stats ? task.output.stats.warnings : []
}

export function isLongRunningTask(task: any) {
  return task.output && task.output.status
}

function getSkippedMessage(task: any) {
  let str = ''
  str += chalk.dim('[skipped')
  if (isString(task.output)) {
    str += chalk.dim(`: ${task.output}`)
  }
  str += chalk.dim(']')
  return str
}

export function getStatusMessageForLongRunningTask(task: any) {
  switch (task.output.status) {
    case 'working':
      const message = task.output.message
      const progressBar = task.output.percentage
        ? createProgressBar(task.output.percentage)
        : ''
      return chalk.dim(` ${arrowRight} ${message} ${progressBar}`)
    case 'ok':
      return chalk.dim(` ${arrowRight} watching for changes`)
    default:
      return ''
  }
}

export function getStatusMessageForRunOnceTask(
  task: any,
  opts: { progress: boolean } = { progress: true }
) {
  if (task.hasFailed() || !task.output) {
    return ''
  }
  let str = chalk.dim(` ${arrowRight}`)
  const message = isString(task.output) ? task.output : task.output.message
  if (message) {
    str += chalk.dim(` ${message}`)
  }
  if (opts.progress && task.output.percentage) {
    const progressBar = createProgressBar(task.output.percentage)
    str += chalk.dim(` ${progressBar}`)
  }
  return str
}
