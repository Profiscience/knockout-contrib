import * as path from 'path'
import * as fs from 'fs-extra'
import { merge, throttle } from 'lodash'
import proxy from 'http-proxy-middleware'
import * as koa from 'koa'
// @ts-ignore
import * as connect from 'koa-connect'
import Router from 'koa-router'
import * as webpack from 'webpack'
import serve from 'webpack-serve'
// @ts-ignore
import { Server } from 'webpack-dev-server/lib/Server'
import { Observable } from 'rxjs'
import { createWebpackConfig } from './config'

let ready: boolean

type DevServerOptions = {
  context: string
  entry: webpack.Entry
  compat?: boolean
  port?: number
  proxy?: any // @todo
  public?: boolean
  check?: boolean
  verbose?: boolean
}

export async function initDevServer(opts: DevServerOptions) {
  ;(process as any).noDeprecation = true

  return new Observable((observer) => {
    const config = merge(createWebpackConfig({ ...opts, outDir: '' }), {
      output: {
        path: opts.context,
        publicPath: '/hot/'
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
            serveFile(
              opts.context,
              ctx,
              'SupportSite/_dist/DEV/styles.Common.css'
            )
          )
          router.get('/hot/styles.Login.css', (ctx: koa.Context) =>
            serveFile(
              opts.context,
              ctx,
              'SupportSite/_dist/DEV/styles.Login.css'
            )
          )
          router.get('/hot/fonts/:file*', (ctx: koa.Context) =>
            serveFile(
              opts.context,
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

async function serveFile(
  projectRoot: string,
  ctx: koa.Context,
  rootRelativeFd: string
) {
  const fd = path.join(projectRoot, rootRelativeFd)
  if (fs.existsSync(fd)) {
    const stats = await fs.stat(fd)
    ctx.status = 200
    ctx.set('Content-Length', stats.size.toString())
    ctx.type = path.extname(fd)
    ctx.body = fs.createReadStream(fd)
  }
}
