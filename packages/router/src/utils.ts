import isFunction from 'lodash/isFunction'
import isPlainObject from 'lodash/isPlainObject'
import isUndefined from 'lodash/isUndefined'
import noop from 'lodash/noop'
import startsWith from 'lodash/startsWith'
import { IContext } from './'
import { Context } from './context'
import { Router, Middleware, LifecycleGeneratorMiddleware } from './router'

export type AsyncCallback<T> = (done?: (t: T) => void) => Promise<T> | void
export type SyncCallback<T> = () => T
export type Callback<T> = AsyncCallback<T> | SyncCallback<T>
export type MaybeArray<T> = T | T[]
export type MaybePromise<T> = T | Promise<T>

export function flatMap<T, R>(
  collection: T[],
  fn: (t: T) => MaybeArray<R>
): R[] {
  const flattened = []
  for (const i of collection) {
    const ret = fn(i)
    if (Array.isArray(ret)) {
      flattened.push(...ret)
    } else {
      flattened.push(ret)
    }
  }
  return flattened
}

export async function sequence(
  callbacks: Callback<boolean | void>[],
  ...args: any[]
): Promise<{
  count: number
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

export function resolveHref({
  router,
  path
}: {
  router: Router
  path: string
}) {
  return router.ctx.base + path
}

export function isActivePath({
  router,
  path
}: {
  router: Router
  path: string
}): boolean {
  let ctx = router.ctx
  while (ctx) {
    // create dependency on isNavigating so that this works with nested routes
    // inside a computed
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

export function getRouterForBindingContext(
  bindingCtx: ko.BindingContext
): Router {
  while (true) {
    if (bindingCtx.$router) {
      return bindingCtx.$router
    } else if (!bindingCtx.$parentContext) {
      return Router.head
    } else {
      bindingCtx = bindingCtx.$parentContext as ko.BindingContext
    }
  }
}

// tslint:disable-next-line no-console
const _consoleLogger: any = console
const _logger = (t: string) => (...ms: string[]) =>
  _consoleLogger[t]('[@profiscience/knockout-contrib-router]', ...ms)
export const log = {
  error: _logger('error'),
  warn: _logger('warn')
}
