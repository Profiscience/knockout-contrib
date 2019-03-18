import { takeRight, uniq } from 'lodash'
import logUpdate from 'log-update'
import chalk from 'chalk'
import { IRawOutput, RawReporter } from './raw'

export class TTYReporter extends RawReporter {
  public _id?: NodeJS.Timer
  private _prevOutput?: string

  public end(err: any) {
    super.end(err, true) // pass through to forceShowErrors
    logUpdate.done()
  }

  protected update(raw: IRawOutput, forceShowErrors?: boolean) {
    const { errors, output, warnings, working } = raw
    const showErrors = forceShowErrors || !working

    output.unshift(
      `For help with the UniversitySite build CLI run ${chalk.cyan(
        'yarn run help'
      )} or use the ${chalk.cyan(
        '--help'
      )} flag with any command (e.g. yarn build --help)\n`
    )

    if (!showErrors) {
      const maxLines = (process.stdout as any).rows
      const visibleOutput = takeRight(output, maxLines).join('\n')
      if (visibleOutput !== this._prevOutput) {
        process.stdout.write('\x1Bc')
        logUpdate(visibleOutput)
        this._prevOutput = visibleOutput
      }
      // prevents updating the CLI a bunch when at rest
    } else if (this._prevOutput) {
      logUpdate.clear()
      logUpdate(output.join('\n'))

      if (warnings.length !== 0) {
        process.stdout.write(chalk.yellow('\nWarnings:\n\n'))
        process.stdout.write(
          chalk.yellow(
            uniq(warnings)
              .join('\n\n\n')
              .trim()
          )
        )
      }

      if (errors.length !== 0) {
        process.stderr.write(chalk.red('\nErrors:\n\n'))
        process.stderr.write(
          chalk.red(
            uniq(errors)
              .join('\n\n\n')
              .trim()
          )
        )
      }

      this._prevOutput = undefined
    }
  }
}
