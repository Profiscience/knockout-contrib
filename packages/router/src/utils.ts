import { IContext } from './'
import { Context } from './context'
import { Router, Middleware, LifecycleGeneratorMiddleware } from './router'

export type AsyncCallback<T> = (done?: (t: T) => void) => Promise<T> | void
export type SyncCallback<T> = () => T
export type Callback<T> = AsyncCallback<T> | SyncCallback<T>
export type MaybeArray<T> = T | T[]
export type MaybePromise<T> = T | Promise<T>

export const noop = () => { /* void */ }
export const isPromise = (x: any = {}) => typeof x.then === 'function'
export const isIterable = (x: any = {}) => typeof x[Symbol.iterator] === 'function'
export const startsWith = (string: string, target: string) => string.indexOf(target) === 0
export const castArray = <T>(x: MaybeArray<T>): T[] => Array.isArray(x) ? x : [x]
export const flatten = <T>(xs: MaybeArray<T>[]): T[] => xs.reduce((arr: T[], x) => [...arr, ...castArray(x)], []) as T[]
export const flatMap = <T, R>(xs: T[], fn: (t: T) => MaybeArray<R>): R[] => flatten(xs.map(fn))
export const promisify = (_fn: (...args: any[]) => any) => async (...args: any[]) => await (
  _fn.length === args.length + 1
    ? new Promise((r) => _fn(...args, r))
    : _fn(...args)
)

export async function sequence(callbacks: Callback<boolean | void>[], ...args: any[]): Promise<{
  count: number,
  success: boolean
}> {
  let count = 0
  let success = true
  for (const _fn of callbacks) {
    count++
    const ret = await promisify(_fn)(...args)
    if (ret === false) {
      success = false
      break
    }
  }
  return { count, success }
}

export function traversePath(router: Router, path: string) {
  if (path.indexOf('//') === 0) {
    path = path.replace('//', '/')
    while (!router.isRoot) {
      router = router.ctx.$parent.router
    }
  } else {
    if (path.indexOf('./') === 0) {
      path = path.replace('./', '/')
      router = router.ctx.$child.router
    }
    while (path && path.match(/\/?\.\./i) && !router.isRoot) {
      router = router.ctx.$parent.router
      path = path.replace(/\/?\.\./i, '')
    }
  }
  return { router, path }
}

export function resolveHref({ router, path }: { router: Router, path: string }) {
  return router.ctx.base + path
}

export function isActivePath({ router, path }: { router: Router, path: string }): boolean {
  let ctx = router.ctx
  while (ctx) {
    // create dependency on isNavigating so that this works with nested routes inside a computed
    ctx.router.isNavigating()

    if (ctx.$child ? startsWith(path, ctx.pathname) : path === ctx.pathname) {
      path = path.substr(ctx.pathname.length) || '/'
      ctx = ctx.$child
    } else {
      return false
    }
  }
  return true
}

export function castLifecycleObjectMiddlewareToGenerator(fn: Middleware): LifecycleGeneratorMiddleware {
  return async function*(ctx: Context & IContext) {
    const ret = await promisify(fn)(ctx)
    if (typeof ret === 'undefined') return
    if (isIterable(ret)) {
      for await (const v of ret) yield await v
    } else {
      if (isPromise(ret)) yield await ret
      if (ret.beforeRender) yield await promisify(ret.beforeRender)()
      if (ret.afterRender) yield await promisify(ret.afterRender)()
      if (ret.beforeDispose) yield await promisify(ret.beforeDispose)()
      if (ret.afterDispose) yield await promisify(ret.afterDispose)()
    }
  }
}

export function getRouterForBindingContext(bindingCtx: KnockoutBindingContext) {
  while (bindingCtx) {
    if (bindingCtx.$router) {
      return bindingCtx.$router
    }
    bindingCtx = bindingCtx.$parentContext
  }
  return Router.head
}

// tslint:disable-next-line no-console
const _consoleLogger: any = console
const _logger = (t: string) => (...ms: string[]) => _consoleLogger[t]('[@profiscience/knockout-contrib-router]', ...ms)
export const log = {
  error: _logger('error'),
  warn: _logger('warn')
}
