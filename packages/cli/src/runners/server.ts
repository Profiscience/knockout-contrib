import { EventEmitter } from 'events'
import * as path from 'path'
import { castArray, takeRight } from 'lodash'
import chalk from 'chalk'
import chokidar from 'chokidar'
import cursor from 'cli-cursor'
import { cross, warning } from 'figures'
// @ts-ignore
import keypress from 'keypress'
import logUpdate from 'log-update'
import notifier from 'node-notifier'
import { Observable } from 'rxjs'
import {
  buildStyles,
  startDevelopmentServer,
  DevServerOptions
} from '@ali/build'
import config, { projectRoot } from '../config'
import { TaskRunner } from '../task-runner'
import { yarnInstall } from '../prelude/npm-deps'

let ready = false

export class DevServerRunner extends TaskRunner {
  constructor(opts: DevServerOptions & { watch?: true }) {
    const host = opts.public ? '0.0.0.0' : 'localhost'

    Object.assign(opts, { watch: true })

    const stdin: any = process.stdin
    keypress(stdin)
    stdin.setRawMode(true)
    cursor.hide()

    stdin.on('keypress', async (char: string, key = { sequence: '' }) => {
      const exit = char === 'q' || key.sequence === '\u0003'
      if (exit) {
        process.exit()
      }
    })

    hub = new DevServerEventEmitter()

    super(
      [
        {
          title: 'Dependencies',
          task: () => registerUpdateDependenciesHandler()
        },
        {
          title: 'Apps',
          task: () => startDevelopmentServer(opts)
        },
        {
          title: 'Styles',
          task: () =>
            buildStyles({
              ...opts,
              files: castArray(config.styles),
              cacheId: 'shared_styles',
              outFile: 'styles.shared.css'
            })
        }
      ],
      {
        concurrent: true,
        ...(opts.verbose
          ? { verbose: true }
          : {
              raw: (raw) => {
                const maxLines = (process.stdout as any).rows
                const { errors, warnings, output, working } = raw
                if (!working) {
                  if (errors.length === 0 && warnings.length === 0) {
                    output.push(
                      `\n${chalk.bold('Serving requests at ')} http://${host}:${
                        opts.port
                      }\n`,

                      chalk.green.bold('\n🎉 No errors or warnings\n')
                    )
                  } else {
                    if (errors.length !== 0) {
                      output.push(
                        chalk.red.bold(`\n${cross} Errors:\n`),
                        chalk.red(errors.join('\n'))
                      )
                    }
                    if (warnings.length !== 0) {
                      output.push(
                        chalk.yellow.bold(`\n${warning} Warnings:\n`),
                        chalk.yellow(warnings.join('\n'))
                      )
                    }
                    notifier.notify({
                      title: 'Ali Development Server',
                      message: `${errors.length} Errors, ${
                        warnings.length
                      } Warnings`
                    })
                  }

                  output.push(
                    `d ${chalk.dim('reinstall dependencies (node_modules)')}`,
                    `q ${chalk.dim('exit')}`
                  )
                }

                if (working) {
                  logUpdate(takeRight(output, maxLines).join('\n'))
                } else {
                  logUpdate(output.join('\n'))
                }
              }
            })
      }
    )
  }
}

function registerUpdateDependenciesHandler() {
  return new Observable((observer) => {
    observer.next({ status: 'ok' })

    hub.on('BRANCH_CHANGE', () => reinstallDeps)

    process.stdin.on('keypress', async (char) => {
      if (ready && char === 'd') {
        try {
          await reinstallDeps()
        } catch (e) {
          observer.next({ status: 'error', message: e.message })
        }
      }
    })

    async function reinstallDeps() {
      const yarnProc = yarnInstall()

      ready = false

      await new Promise((resolve) =>
        yarnProc.stdout
          .on('data', (chunk) =>
            observer.next({
              status: 'working',
              message: chunk.toString().trim()
            })
          )
          .on('close', resolve)
      )

      ready = true
      observer.next({ status: 'ok' })
    }
  })
}

let hub: DevServerEventEmitter

type DevServerEvent = 'BRANCH_CHANGE'

// tslint:disable-next-line:max-classes-per-file
class DevServerEventEmitter extends EventEmitter {
  constructor() {
    super()
    this._watchGit()
  }

  public on(event: DevServerEvent, handler: (...args: any[]) => void) {
    return super.on(event, handler)
  }
  public once(event: DevServerEvent, handler: (...args: any[]) => void) {
    return super.once(event, handler)
  }
  public off(event: DevServerEvent, handler: (...args: any[]) => void) {
    return super.removeListener(event, handler)
  }
  public emit(event: DevServerEvent) {
    return super.emit(event)
  }

  private async _watchGit() {
    let dir = projectRoot

    while (true) {
      try {
        const watcher = chokidar.watch(path.join(dir, '.git/HEAD'))
        watcher.on('change', () => this.emit('BRANCH_CHANGE'))
      } catch (e) {
        // noop
      }
      if (dir === path.resolve(dir, '..')) {
        return
      } else {
        dir = path.resolve(dir, '..')
      }
    }
  }
}
