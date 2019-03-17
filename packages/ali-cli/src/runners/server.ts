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
          skip: skipUnlessAtLeastOneOf(
            opts,
            ...spaBuildScopes,
            BuildScopes.Legacy
          ),
          task: () => registerUpdateDependenciesHandler()
        },
        {
          title: 'Apps',
          task: () => initDevServer(opts)
        },
        {
          title: 'Styles',
          skip: skipUnlessAtLeastOneOf(opts, ...spaBuildScopes),
          task: () => new StylesBuildRunner(opts)
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

async function initAPI() {
  return new Observable((observer) => {
    compileAPI().catch((err) =>
      observer.next({
        status: 'error',
        message: err.message
      })
    )

    hub.on('BRANCH_CHANGE', () => {
      observer.next({
        status: 'working',
        message: 'branch changed, rebuild triggered...'
      })
      compileAPI().catch((err) =>
        observer.next({
          status: 'error',
          message: err.message
        })
      )
    })

    process.stdin.on('keypress', async (char) => {
      if (ready && char === 'c') {
        compileAPI().catch((err) =>
          observer.next({
            status: 'error',
            message: err.message
          })
        )
        observer.next({
          status: 'working',
          message: 'manual rebuild triggered'
        })
      }
    })

    async function compileAPI() {
      ready = false

      const apiRunner = new APIBuildRunner({
        production: false,
        silent: true,
        progressHook: ({ message }) => {
          observer.next({
            status: 'working',
            message
          })
        }
      })

      try {
        await apiRunner.run()
        observer.next({ status: 'ok' })
      } catch (e) {
        observer.next({ status: 'error', message: e.message })
      }

      ready = true
    }
  })
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
async function initDevServer(opts: DevServerOptions) {
  ;(process as any).noDeprecation = true

  return new Observable((observer) => {
    const config = merge(createWebpackConfig(opts), {
      output: {
        path: paths.fromRoot('Client'),
        publicPath: '/hot/'
      }
    })
    config.plugins.push(
      new webpack.ProgressPlugin(
        throttle((percentage, message) => {
          if (ready) {
            return false
          }
          observer.next({
            status: 'working',
            percentage,
            message
          })
        }, 200)
      )
    )
    config.plugins.push({
      apply(compiler: webpack.Compiler) {
        compiler.hooks.emit.tap('dev-server-dashboard', (compilation) => {
          ready = true
          observer.next({
            status: 'ok',
            stats: compilation.getStats().toJson()
          })
        })
        compiler.hooks.compile.tap(
          'dev-server-dashboard',
          () => (ready = false)
        )
      }
    })

    const host = opts.public ? '0.0.0.0' : 'localhost'

    serve(
      {},
      {
        config,
        host,
        port: opts.port,
        devMiddleware: {
          logLevel: 'silent',
          publicPath: '/hot/'
        },
        hotClient: {
          allEntries: true,
          logLevel: 'silent'
        },
        logLevel: 'silent',
        add: async (app, middleware) => {
          await middleware.webpack()
          await middleware.content()

          const router = new Router()

          // styles built independently from webpack, play nice with path
          router.get('/hot/styles.Common.css', (ctx: koa.Context) =>
            serveFile(ctx, 'SupportSite/_dist/DEV/styles.Common.css')
          )
          router.get('/hot/styles.Login.css', (ctx: koa.Context) =>
            serveFile(ctx, 'SupportSite/_dist/DEV/styles.Login.css')
          )
          router.get('/hot/fonts/:file*', (ctx: koa.Context) =>
            serveFile(
              ctx,
              path.join('SupportSite/_dist/DEV/fonts', ctx.params.file)
            )
          )

          // optimization.splitChunks disabled in development
          router.get('/hot/chunk.common.js', (ctx: koa.Context) => {
            ctx.body = ''
          })
          router.get('/hot/chunk.vendors.js', (ctx: koa.Context) => {
            ctx.body = ''
          })

          app.use(router.routes())

          app.use(
            connect(
              proxy('!/hot', {
                target: opts.proxy,
                changeOrigin: true,
                headers: { 'x-dev-server': 'yes' },
                autoRewrite: true
              })
            )
          )
        }
      }
    )
  })
}

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

  private _watchGit() {
    const watcher = chokidar.watch(paths.fromRoot('.git/HEAD'))
    watcher.on('change', () => this.emit('BRANCH_CHANGE'))
  }
}
