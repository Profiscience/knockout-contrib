import 'core-js/es7/symbol'
import * as ko from 'knockout'
import { IContext } from './'
import { Route } from './route'
import { Router, Middleware } from './router'
import {
  Callback,
  isPromise,
  castLifecycleObjectMiddlewareToGenerator,
  sequence
} from './utils'

export class Context /* implements IContext, use Context & IContext */ {
  public $child?: Context & IContext
  public route!: Route
  public params!: { [k: string]: any }
  public pathname!: string
  public _redirect?: string
  public _redirectArgs?: {
    push: false
    force?: boolean
    with?: { [prop: string]: any }
  }

  private readonly _beforeNavigateCallbacks: Callback<void>[] = []
  private _queue: Promise<void>[] = []
  private _appMiddlewareDownstream: Callback<void>[] = []
  private _routeMiddlewareDownstream: Callback<void>[] = []

  constructor(
    public router: Router,
    public $parent: undefined | Context & IContext,
    public path: string,
    _with: { [key: string]: any } = {}
  ) {
    const ctx: Context & IContext = this as any
    const route = router.resolveRoute(path)

    if (!route) {
      throw new Error(
        // tslint:disable-next-line:max-line-length
        `[@profiscience/knockout-contrib-router] Router@${
          router.depth
        } context initialized with path ${path}, but no matching route was found`
      )
    }

    const { params, pathname, childPath } = route.parse(path)

    Object.assign(
      this,
      {
        params,
        pathname,
        route
      },
      _with
    )

    if ($parent) {
      $parent.$child = ctx
    }
    if (childPath) {
      // tslint:disable-next-line no-unused-expression
      new Router(childPath, ctx).ctx
    }
  }

  public addBeforeNavigateCallback(cb: Callback<void>) {
    this._beforeNavigateCallbacks.unshift(cb)
  }

  public get base(): string {
    return this.router.isRoot
      ? Router.base
      : (this.$parent as Context & IContext).base +
          (this.$parent as Context & IContext).pathname
  }

  // full path w/o base
  public get canonicalPath() {
    return (
      this.base.replace(new RegExp(this.$root.base, 'i'), '') + this.pathname
    )
  }

  public get element() {
    return this._redirect
      ? undefined
      : document.getElementsByClassName('router-view')[this.$parents.length]
  }

  public get $root(): Context & IContext {
    let ctx: Context & IContext = this as any
    while (ctx.$parent) ctx = ctx.$parent
    return ctx
  }

  public get $parents(): (Context & IContext)[] {
    const parents: (Context & IContext)[] = []
    let parent = this.$parent
    while (parent) {
      parents.push(parent)
      parent = parent.$parent
    }
    return parents
  }

  public get $children(): (Context & IContext)[] {
    const children: (Context & IContext)[] = []
    let child = this.$child
    while (child) {
      children.push(child)
      child = child.$child
    }
    return children
  }

  public queue(promise: Promise<void>) {
    this._queue.push(promise)
  }

  public redirect(path: string, args: { [k: string]: any } = {}) {
    this._redirect = path
    this._redirectArgs = Object.assign({}, args, { push: false as false })
  }

  public async runBeforeNavigateCallbacks(): Promise<boolean> {
    let ctx: void | Context & IContext = this as any
    let callbacks: Callback<boolean | void>[] = []
    while (ctx) {
      callbacks = [...ctx._beforeNavigateCallbacks, ...callbacks]
      ctx = ctx.$child
    }
    const { success } = await sequence(callbacks)
    return success
  }

  public render() {
    let ctx: void | Context & IContext = this as any
    while (ctx) {
      if (typeof ctx._redirect === 'undefined') {
        ctx.router.component(ctx.route.component)
      }
      ctx = ctx.$child
    }
    ko.tasks.runEarly()
  }

  public async runBeforeRender(flush = true) {
    const ctx: Context & IContext = this as any
    const appMiddlewareDownstream = Context.runMiddleware(
      Router.middleware,
      ctx
    )
    const routeMiddlewareDownstream = Context.runMiddleware(
      this.route.middleware,
      ctx
    )

    const { count: numAppMiddlewareRanPreRedirect } = await sequence(
      appMiddlewareDownstream
    )
    const { count: numRouteMiddlewareRanPreRedirect } = await sequence(
      routeMiddlewareDownstream
    )

    this._appMiddlewareDownstream = appMiddlewareDownstream.slice(
      0,
      numAppMiddlewareRanPreRedirect
    )
    this._routeMiddlewareDownstream = routeMiddlewareDownstream.slice(
      0,
      numRouteMiddlewareRanPreRedirect
    )

    if (this.$child && typeof this._redirect === 'undefined') {
      await this.$child.runBeforeRender(false)
    }
    if (flush) {
      await this.flushQueue()
    }
  }

  public async runAfterRender() {
    await sequence([
      ...this._appMiddlewareDownstream,
      ...this._routeMiddlewareDownstream
    ])
    await this.flushQueue()
  }

  public async runBeforeDispose(flush = true) {
    if (this.$child && typeof this._redirect === 'undefined') {
      await this.$child.runBeforeDispose(false)
    }
    await sequence([
      ...this._routeMiddlewareDownstream,
      ...this._appMiddlewareDownstream
    ])
    if (flush) {
      await this.flushQueue()
    }
  }

  public async runAfterDispose(flush = true) {
    if (this.$child && typeof this._redirect === 'undefined') {
      await this.$child.runAfterDispose(false)
    }
    await sequence([
      ...this._routeMiddlewareDownstream,
      ...this._appMiddlewareDownstream
    ])
    if (flush) {
      await this.flushQueue()
    }
  }

  private async flushQueue() {
    const thisQueue = Promise.all(this._queue).then(() => {
      this._queue = []
    })
    const childQueues = this.$children.map((c) => c.flushQueue())
    await Promise.all<Promise<void>>([thisQueue, ...childQueues])
  }

  private static runMiddleware(
    middleware: Middleware[],
    ctx: Context & IContext
  ): Callback<void>[] {
    return middleware.map((fn) => {
      const runner = castLifecycleObjectMiddlewareToGenerator(fn)(ctx)
      let beforeRender = true
      return async () => {
        const ret = runner.next()
        if (isPromise(ret)) {
          await ret
        } else if (
          isPromise((ret as IteratorResult<Promise<void> | void>).value)
        ) {
          await (ret as IteratorResult<Promise<void> | void>).value
        }
        if (beforeRender) {
          // this should only block the sequence for the first call,
          // and allow cleanup after the redirect
          beforeRender = false
          return typeof ctx._redirect === 'undefined'
        } else {
          return true
        }
      }
    })
  }
}
