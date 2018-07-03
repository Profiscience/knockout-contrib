import * as ko from 'knockout'
import { IContext } from './'
import { Route } from './route'
import { Router, Middleware, Lifecycle } from './router'
import { MaybePromise } from './utils'

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

  private readonly _beforeNavigateCallbacks: (() => MaybePromise<
    void | false
  >)[] = []
  private _queue: Promise<void>[] = []
  private _appMiddlewareLifecycles: Lifecycle[] = []
  private _routeMiddlewareLifecycles: Lifecycle[] = []

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

  public addBeforeNavigateCallback(cb: () => MaybePromise<false | void>) {
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
    let callbacks: (() => MaybePromise<boolean | void>)[] = []
    while (ctx) {
      callbacks = [...ctx._beforeNavigateCallbacks, ...callbacks]
      ctx = ctx.$child
    }
    for (const cb of callbacks) {
      const ret = await cb()
      if (ret === false) {
        return false
      }
    }
    return true
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
    this._appMiddlewareLifecycles = await Context.startLifecycle(
      Router.middleware,
      ctx
    )
    this._routeMiddlewareLifecycles = await Context.startLifecycle(
      this.route.middleware,
      ctx
    )
    if (this.$child && typeof this._redirect === 'undefined') {
      await this.$child.runBeforeRender(false)
    }
    if (flush) {
      await this.flushQueue()
    }
  }

  public async runAfterRender() {
    for (const l of [
      ...this._appMiddlewareLifecycles,
      ...this._routeMiddlewareLifecycles
    ]) {
      if (l.afterRender) await l.afterRender()
    }
    await this.flushQueue()
  }

  public async runBeforeDispose(flush = true) {
    if (this.$child && typeof this._redirect === 'undefined') {
      await this.$child.runBeforeDispose(false)
    }
    for (const l of [
      ...this._routeMiddlewareLifecycles,
      ...this._appMiddlewareLifecycles
    ]) {
      if (l.beforeDispose) await l.beforeDispose()
    }
    if (flush) {
      await this.flushQueue()
    }
  }

  public async runAfterDispose(flush = true) {
    if (this.$child && typeof this._redirect === 'undefined') {
      await this.$child.runAfterDispose(false)
    }
    for (const l of [
      ...this._routeMiddlewareLifecycles,
      ...this._appMiddlewareLifecycles
    ]) {
      if (l.afterDispose) await l.afterDispose()
    }
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

  private static async startLifecycle(
    middleware: Middleware[],
    ctx: Context & IContext
  ): Promise<Lifecycle[]> {
    const downstream: Lifecycle[] = []
    for (const fn of middleware) {
      if (typeof ctx._redirect !== 'undefined') break

      let lifecycle: Lifecycle
      const ret = await fn(ctx) // tslint:disable-line:await-promise

      if (ret) {
        // iterable (generator)
        if (typeof (ret as any).next === 'function') {
          // tslint:disable-line:strict-type-predicates
          const iterator = ret as IterableIterator<any>
          lifecycle = {
            beforeRender: () => iterator.next().value,
            afterRender: () => iterator.next().value,
            beforeDispose: () => iterator.next().value,
            afterDispose: () => iterator.next().value
          }
        } else {
          lifecycle = ret as Lifecycle
        }

        if (lifecycle.beforeRender) await lifecycle.beforeRender()
        downstream.push(lifecycle)
      }
    }

    return downstream
  }
}
