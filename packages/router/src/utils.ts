import { IContext } from './'
import { Context } from './context'
import { Router } from './router'

export type MaybeArray<T> = T | T[]
export type MaybePromise<T> = T | Promise<T>

export const noop = (): void => {
  /* void */
}
export const startsWith = (string: string, target: string): boolean =>
  string.startsWith(target)
export const flatMap = <T, R>(xs: T[], fn: (t: T) => MaybeArray<R>): R[] =>
  flatten(xs.map(fn))

export function flatten<T>(xs: MaybeArray<T>[]): T[] {
  return xs.reduce((arr: T[], x) => [...arr, ...castArray(x)], [])
}

export function castArray<T>(x: MaybeArray<T>): T[] {
  return Array.isArray(x) ? x : [x]
}

export function traversePath(
  router: Router,
  path: string
): { router: Router; path: string } {
  if (path.startsWith('//')) {
    path = path.replace('//', '/')
    while (!router.isRoot) {
      router = (router.ctx.$parent as Context & IContext).router
    }
  } else {
    if (path.startsWith('./')) {
      path = path.replace('./', '/')
      if (!router.ctx.$child) {
        throw new Error(
          `[@profiscience/knockout-contrib-router] Attempted to traverse path "${path}" from router@(${router.depth}) and ran out of children. Are you sure you want "./"?`
        )
      }
      router = router.ctx.$child.router
    }
    const dotDotSlash = /\/?\.\./i
    while (path && dotDotSlash.test(path) && !router.isRoot) {
      router = (router.ctx.$parent as Context & IContext).router
      path = path.replace(/\/?\.\./i, '')
    }
  }
  return { router, path }
}

export function getAnchor(el: Node | null): HTMLAnchorElement | void {
  while (el) {
    if (isAnchor(el)) {
      return el
    } else {
      el = el.parentNode
    }
  }
}

function isAnchor(el: Node): el is HTMLAnchorElement {
  return el.nodeName === 'A'
}

export function resolveHref({
  router,
  path
}: {
  router: Router
  path: string
}): string {
  return router.ctx.base + path.replace(/\/\*$/, '')
}

export function isActivePath({
  router,
  path
}: {
  router: Router
  path: string
}): boolean {
  let ctx: Context | void = router.ctx
  while (ctx) {
    // create dependency on isNavigating so that this works with nested routes inside a computed
    ctx.router.isNavigating()

    if (path === '/*') return true

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
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (bindingCtx.$router) {
      return bindingCtx.$router
    } else if (!bindingCtx.$parentContext) {
      return Router.head
    } else {
      bindingCtx = bindingCtx.$parentContext
    }
  }
}

type LogLevel = 'error' | 'warn'
type LogMessage = string | Error
type Logger = (...msgs: LogMessage[]) => void
const _consoleLogger: Record<LogLevel, Logger> = console
const _logger = (t: LogLevel) => (...ms: LogMessage[]) =>
  _consoleLogger[t]('[@profiscience/knockout-contrib-router]', ...ms)
export const log: Record<LogLevel, Logger> = {
  error: _logger('error'),
  warn: _logger('warn')
}
