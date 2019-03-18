import * as path from 'path'
import * as fs from 'fs-extra'
import { merge, throttle } from 'lodash'
import proxy from 'http-proxy-middleware'
import koa from 'koa'
// @ts-ignore
import connect from 'koa-connect'
import Router from 'koa-router'
import webpack from 'webpack'
import serve from 'webpack-serve'
// @ts-ignore
import { Observable } from 'rxjs'
import { createWebpackConfig, IWebpackConfigOptions } from './config'

let ready: boolean

export type DevServerOptions = IWebpackConfigOptions & {
  port?: number
  proxy?: string
  public?: boolean
  verbose?: boolean
}

export async function startDevelopmentServer(opts: DevServerOptions) {
  ;(process as any).noDeprecation = true

  return new Observable((observer) => {
    const defaultConfig = createWebpackConfig(opts)
    const { filename, chunkFilename } = defaultConfig.output as any
    const config = merge(defaultConfig, {
      output: {
        filename: path.join('hot', filename),
        chunkFilename: path.join('hot', chunkFilename),
        publicPath: '/'
      }
    })

    if (!config.plugins) config.plugins = []

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
        compiler.hooks.emit.tap('stats', (compilation) => {
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
          publicPath: '/'
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
          router.get('/hot/styles.css', (ctx: koa.Context) =>
            serveFile(ctx, path.join(opts.outDir, '/styles.css'))
          )

          // optimization.splitChunks disabled in development
          router.get('/hot/chunk.common.js', (ctx: koa.Context) => {
            ctx.body = ''
          })
          router.get('/hot/chunk.vendors.js', (ctx: koa.Context) => {
            ctx.body = ''
          })

          // fonts, images, etc.
          router.get('/hot/:file*', (ctx: koa.Context) =>
            serveFile(ctx, path.join(opts.outDir, ctx.params.file))
          )

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

async function serveFile(ctx: koa.Context, file: string) {
  if (fs.existsSync(file)) {
    const stats = await fs.stat(file)
    ctx.status = 200
    ctx.set('Content-Length', stats.size.toString())
    ctx.type = path.extname(file)
    ctx.body = fs.createReadStream(file)
  }
}
