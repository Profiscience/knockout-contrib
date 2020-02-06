import * as ko from 'knockout'
import { IContext } from './'
import { Route } from './route'
import { Router, Middleware, Lifecycle, UrlFragments } from './router'
import { MaybePromise } from './utils'

export class Context /* implements IContext, use Context & IContext */ {
  public $child?: Context & IContext
  public route!: Route
  public params!: Record<string, unknown>
  public path!: string
  public pathname!: string
  public search!: string
  public hash!: string
  public _redirect?: string
  public _redirectArgs?: {
    push: false
    force?: boolean
    with?: Record<string, unknown>
  }

  private readonly _beforeNavigateCallbacks: (() => MaybePromise<
    void | false
  >)[] = []
  private _queue: Promise<void>[] = []
  private _appMiddlewareLifecycles: Lifecycle[] = []
  private _routeMiddlewareLifecycles: Lifecycle[] = []

  constructor(
    public router: Router,
    public $parent: undefined | (Context & IContext),
    urlFragments: UrlFragments,
    _with: Record<string, unknown> = {}
  ) {
    const ctx: Context & IContext = (this as unknown) as Context & IContext
    const { path, search, hash } = urlFragments
    const route = router.resolveRoute(path)

    if (!route) {
      throw new Error(
        `[@profiscience/knockout-contrib-router] Router@${router.depth} context initialized with path ${path}, but no matching route was found`
      )
    }

    const { params, pathname, childPath } = route.parse(path)

    Object.assign(
      this,
      {
        hash,
        path,
        params,
        pathname,
        route,
        search
      },
      _with
    )

    if ($parent) {
      $parent.$child = ctx
    }
    if (childPath) {
      new Router(childPath + search + hash, ctx).ctx
    }
  }

  public addBeforeNavigateCallback(cb: () => MaybePromise<false | void>): void {
    this._beforeNavigateCallbacks.unshift(cb)
  }

  public get base(): string {
    return this.router.isRoot
      ? Router.base
      : (this.$parent as Context & IContext).base +
          (this.$parent as Context & IContext).pathname
  }

  // full path w/o base
  public get canonicalPath(): string {
    return (
      this.base.replace(new RegExp(`^${Router.base}`, 'i'), '') + this.pathname
    )
  }

  public get element(): undefined | HTMLElement {
    return this._redirect
      ? undefined
      : (document.getElementsByClassName('router-view')[
          this.$parents.length
        ] as HTMLElement)
  }

  public get $root(): Context & IContext {
    let ctx: Context & IContext = (this as unknown) as Context & IContext
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

  public queue(promise: Promise<void>): void {
    this._queue.push(promise)
  }

  public redirect(path: string, args: Record<string, unknown> = {}): void {
    this._redirect = path
    this._redirectArgs = Object.assign({}, args, { push: false as false })
  }

  public async runBeforeNavigateCallbacks(): Promise<boolean> {
    let ctx: void | (Context & IContext) = (this as unknown) as Context &
      IContext
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

  public render(): void {
    let ctx: void | (Context & IContext) = (this as unknown) as Context &
      IContext
    while (ctx) {
      if (typeof ctx._redirect === 'undefined') {
        ctx.router.component(ctx.route.component)
      }
      ctx = ctx.$child
    }
    ko.tasks.runEarly()
  }

  public async runBeforeRender(flush = true): Promise<void> {
    const ctx: Context & IContext = (this as unknown) as Context & IContext
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

  public async runAfterRender(): Promise<void> {
    const isRedirecting = typeof this._redirect !== 'undefined'
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let ctx: Context | undefined = this
    do {
      for (const l of [
        ...ctx._appMiddlewareLifecycles,
        ...ctx._routeMiddlewareLifecycles
      ]) {
        if (l.afterRender) await l.afterRender()
      }
      ctx = ctx.$child
    } while (isRedirecting && ctx)
    await this.flushQueue()
  }

  public async runBeforeDispose(flush = true): Promise<void> {
    if (this.$child) {
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

  public async runAfterDispose(flush = true): Promise<void> {
    if (this.$child) {
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

  private async flushQueue(): Promise<void> {
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
    const iterate = (
      i: IterableIterator<MaybePromise<void>> | AsyncIterableIterator<void>
    ) => (): MaybePromise<void> => {
      const v = i.next()
      if ('value' in v) return v.value
    }
    for (const fn of middleware) {
      if (typeof ctx._redirect !== 'undefined') break

      let lifecycle: Lifecycle
      const ret = await fn(ctx)

      if (ret) {
        // iterable (generator)
        if ('next' in ret) {
          const iterator = ret
          lifecycle = {
            beforeRender: iterate(iterator),
            afterRender: iterate(iterator),
            beforeDispose: iterate(iterator),
            afterDispose: iterate(iterator)
          }
        } else {
          lifecycle = ret
        }

        if (lifecycle.beforeRender) await lifecycle.beforeRender()
        downstream.push(lifecycle)
      }
    }

    return downstream
  }
}
