export { JSONReporter } from './json'
export { IRawOutput, RawReporter } from './raw'
export { TTYReporter } from './tty'
export { VerboseReporter } from './verbose'

import * as fs from 'fs'
import { isString, each } from 'lodash'
import { JSONReporter } from './json'
import { TTYReporter } from './tty'
import { VerboseReporter } from './verbose'

interface IReporterOptions {
  json?: boolean | string
  verbose?: boolean | string
}

interface IReporter {
  render(): void
  end(err?: Error): void
}

export class Reporter {
  public static nonTTY = true
  private _reporters: IReporter[] = []

  constructor(tasks: any[], options: IReporterOptions) {
    let useDefault = true

    if (options.json === true && options.verbose === true) {
      let err = ''
      err += '--json and --verbose can not be used simultaneously '
      err += 'unless an output file is supplied for at least one'
      throw new Error(err)
    }

    if (options.json) {
      if (isString(options.json)) {
        const logFile = fs.createWriteStream(options.json)
        this._reporters.push(new JSONReporter(tasks, logFile))
      } else {
        useDefault = false
        this._reporters.push(new JSONReporter(tasks, process.stdout))
      }
    }

    if (options.verbose) {
      if (isString(options.verbose)) {
        const logFile = fs.createWriteStream(options.verbose)
        this._reporters.push(new VerboseReporter(tasks, logFile, logFile))
      } else {
        useDefault = false
        this._reporters.push(
          new VerboseReporter(tasks, process.stdout, process.stderr)
        )
      }
    }

    if (useDefault) {
      if (process.stdout.isTTY) {
        this._reporters.push(new TTYReporter(tasks))
      } else {
        this._reporters.push(
          new VerboseReporter(tasks, process.stdout, process.stderr)
        )
      }
    }
  }

  public render() {
    each(this._reporters, (r) => r.render())
  }

  public end(err: any) {
    each(this._reporters, (r) => r.end(err))
  }
}
