import chalk from 'chalk'
import elegantSpinner from 'elegant-spinner'
import * as cursor from 'cli-cursor'
import { getErrors, getWarnings } from './raw'

const ansiClearLine = '\u001b[1000D\u001b[0K'

export class JSONReporter {
  public _id?: NodeJS.Timer
  private _out: NodeJS.Socket | NodeJS.WritableStream
  private _tasks: any[]

  constructor(tasks: any[], out: NodeJS.Socket | NodeJS.WritableStream) {
    this._out = out
    this._tasks = tasks
  }

  public render() {
    if ((this._out as NodeJS.Socket).isTTY) {
      const spinner = elegantSpinner()
      cursor.hide()
      this._id = setInterval(() => {
        this._out.write(`${ansiClearLine} ${chalk.yellow(spinner())}`)
      }, 100)
    }
    if (this._id) {
      // Do not render if we are already rendering
      return
    }
  }

  public end() {
    if (this._id) {
      clearInterval(this._id)
      this._id = undefined
      this._out.write(ansiClearLine)
    }
    this._out.write(JSON.stringify(getOutput(this._tasks)))
  }
}

function getOutput(
  tasks: any[],
  level = 0
): { errors: string[]; warnings: string[] } {
  const errors = []
  const warnings = []

  for (const task of tasks) {
    if (task.isEnabled()) {
      if (task.isSkipped()) {
        continue
      }

      errors.push(...getErrors(task))
      warnings.push(...getWarnings(task))

      if (task.subtasks.length !== 0) {
        const subtaskOutput = getOutput(task.subtasks, level + 1)
        errors.push(...subtaskOutput.errors)
        warnings.push(...subtaskOutput.warnings)
      }
    }
  }

  return { errors, warnings }
}
