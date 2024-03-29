import * as ko from 'knockout'
import { IContext } from './'
import { Context } from './context'
import { RoutePlugin, Route, RouteMap } from './route'
import { castArray, MaybePromise, traversePath, log, getAnchor } from './utils'

export type RouterConfig = {
  base?: string
  hashbang?: boolean
  activePathCSSClass?: string
  preserveHistoryStateOnNavigation?: boolean
  preserveQueryStringOnNavigation?: boolean
}

export type RouterUpdateOptions = {
  push?: boolean
  force?: boolean
  state?: { [prop: string]: any }
  with?: { [prop: string]: any }
}

export type SimpleMiddleware =
  | ((ctx: Context & IContext) => MaybePromise<void>)
  | ((ctx: Context & IContext, done?: () => void) => void)

export type LifecycleMiddleware = (
  ctx: Context & IContext
) => MaybePromise<Lifecycle>

export type GeneratorMiddleware = (ctx: Context & IContext) =>
  | IterableIterator<MaybePromise<void>> // sync generators yielding nothing or a promise
  | AsyncIterableIterator<void> // async generator

export type Middleware =
  | SimpleMiddleware
  | LifecycleMiddleware
  | GeneratorMiddleware

export type Lifecycle = {
  beforeRender?(): MaybePromise<void>
  afterRender?(): MaybePromise<void>
  beforeDispose?(): MaybePromise<void>
  afterDispose?(): MaybePromise<void>
}

export type UrlFragments = {
  path: string
  search: string
  hash: string
}

export class Router {
  private static _head?: Router

  public static get head() {
    if (!this._head) {
      throw new Error('Cannot access Router.head before initialization')
    }
    return this._head
  }

  public static readonly onInit: ((router: Router) => void)[] = [
    () => {
      Router.isNavigating(Router._isNavigating())
      Router._isNavigating.subscribe(Router.isNavigating)
    },
  ]
  public static readonly middleware: Middleware[] = []
  public static readonly config = {
    base: '',
    hashbang: false,
    activePathCSSClass: 'active-path',
    preserveHistoryStateOnNavigation: false,
    preserveQueryStringOnNavigation: false,
  }

  /**
   * If router is not initialized, Router.head is undefined. See above onInit arr.
   */
  private static readonly _isNavigating = ko.pureComputed(() => {
    if (Router.head.isNavigating()) return true
    for (const ctx of Router.head.ctx.$children) {
      if (ctx.router.isNavigating()) return true
    }
    return false
  })
  public static readonly isNavigating = ko.observable(true)

  private static readonly routes: Route[] = []
  private static readonly events: {
    click: 'click'
    popstate: 'popstate'
  } = {
    click: document.ontouchstart ? 'touchstart' : ('click' as any),
    popstate: 'popstate',
  }

  public onInit: ((router: Router) => void)[] = []
  public component: ko.Observable<null | string>
  public isNavigating: ko.Observable<boolean>
  public routes: Route[]
  public isRoot: boolean
  public ctx: Context & IContext
  public bound = false

  constructor(
    url: string,
    $parentCtx?: Context & IContext,
    _with: { [k: string]: any } = {}
  ) {
    this.component = ko.observable(null)
    this.isNavigating = ko.observable(true)
    this.isRoot = typeof $parentCtx === 'undefined'
    this.routes = this.isRoot
      ? Router.routes
      : ($parentCtx as Context & IContext).route.children

    if (this.isRoot) {
      Router._head = this
      document.addEventListener<'click'>(Router.events.click, Router.onclick)
      window.addEventListener(Router.events.popstate, Router.onpopstate)
    }

    this.ctx = new Context(
      this,
      $parentCtx,
      Router.parseUrl(url),
      _with
    ) as Context & IContext
  }

  get initialized(): Promise<Router> {
    if (this.isNavigating()) {
      return new Promise((resolve) => this.onInit.push(resolve))
    } else {
      return Promise.resolve(this)
    }
  }

  get depth(): number {
    return this.ctx.$parents.length
  }

  public init() {
    this.isNavigating(false)
    this.ctx
      .runAfterRender()
      .then(() => {
        this.ctx.router.onInit.forEach((resolve) => resolve(this))
      })
      .catch((err) => log.error('Error initializing router', err))
  }

  public async update(
    url: string,
    args?: boolean | RouterUpdateOptions
  ): Promise<boolean> {
    const toUrlFragments = Router.parseUrl(url)
    const route = this.resolveRoute(toUrlFragments.path)

    if (!route) {
      throw new Error(
        // tslint:disable-next-line:max-line-length
        `[@profiscience/knockout-contrib-router] Router@${this.depth} update() called with path "${toUrlFragments.path}", but no matching route was found`
      )
    }

    const opts = Router.normalizeUpdateOptions(args)
    const fromCtx = this.ctx
    const { pathname, childPath } = route.parse(toUrlFragments.path)
    const currentUrlFragments = Router.parseUrl(Router.getPathFromLocation())
    const useCurrentQueryString =
      Router.config.preserveQueryStringOnNavigation && !toUrlFragments.search

    const samePage =
      fromCtx.route === route && // divergent children (ambiguous route trees)
      pathname === fromCtx.pathname && // same route, different params
      (useCurrentQueryString
        ? true
        : currentUrlFragments.search === toUrlFragments.search) &&
      toUrlFragments.hash === currentUrlFragments.hash

    if (samePage && !opts.force) {
      if (fromCtx.$child && childPath) {
        return await fromCtx.$child.router.update(
          childPath + toUrlFragments.search + toUrlFragments.hash,
          opts
        )
      } else {
        return false
      }
    }

    const shouldNavigate = await fromCtx.runBeforeNavigateCallbacks()

    if (!shouldNavigate) return false

    const toCtx = new Context(this, this.ctx.$parent, toUrlFragments, opts.with)

    this.isNavigating(true)

    const _update = this.update.bind(this)

    // handle race-condition of navigating while awaiting async middleware
    this.update = (_url: string, _args?: boolean | RouterUpdateOptions) => {
      toCtx.redirect(_url, typeof _args === 'boolean' ? undefined : _args)
      return Promise.resolve(true)
    }

    await fromCtx.runBeforeDispose()

    // disposal logic in runBeforeDispose may modify querystring,
    // ensure that doesn't get wiped out by re-parsing the actual window.location
    const search = useCurrentQueryString
      ? Router.parseUrl(Router.getPathFromLocation()).search
      : toUrlFragments.search

    history[opts.push ? 'pushState' : 'replaceState'](
      opts.state,
      document.title,
      toCtx.base + toCtx.path + search + toUrlFragments.hash
    )

    await toCtx.runBeforeRender()

    if (typeof toCtx._redirect === 'undefined') {
      this.component(null)
      ko.tasks.runEarly()
    }

    this.ctx = toCtx
    this.update = _update

    await fromCtx.runAfterDispose()

    toCtx.render()

    if (typeof toCtx._redirect !== 'undefined') {
      try {
        await toCtx.runAfterRender()
      } catch (e) {
        log.warn(
          'Error in afterRender middleware during redirection. This may be caused by attempting to use ctx.component (or a property thereof), or the DOM in the middleware. Because redirection occured, no component was actually rendered. You may wish to add a guard in your middleware to handle this case.'
        )
        log.error(
          e instanceof Error
            ? e
            : typeof e === 'string'
            ? e
            : new Error(`Unknown error: ${e}`)
        )
      }
      const { router: r, path: p } = traversePath(toCtx.router, toCtx._redirect)
      r.update(p, toCtx._redirectArgs).catch((err) =>
        log.error('Error redirecting', err)
      )
    }

    return true
  }

  public resolveRoute(path: string): Route | undefined {
    let matchingRouteWithFewestDynamicSegments
    let fewestMatchingSegments = Infinity

    for (const route of this.routes) {
      if (route.matches(path)) {
        if (route.keys.length === 0) {
          return route
        } else if (
          fewestMatchingSegments === Infinity ||
          (route.keys.length < fewestMatchingSegments &&
            route.keys[0].pattern !== '.*')
        ) {
          fewestMatchingSegments = route.keys.length
          matchingRouteWithFewestDynamicSegments = route
        }
      }
    }
    return matchingRouteWithFewestDynamicSegments
  }

  public dispose() {
    if (this.isRoot) {
      document.removeEventListener(Router.events.click, Router.onclick, false)
      window.removeEventListener(
        Router.events.popstate,
        Router.onpopstate,
        false
      )
      delete Router._head
    }
  }

  static get initialized(): Promise<Router> {
    try {
      return Promise.resolve(Router.head)
    } catch (e) {
      return new Promise((resolve) => this.onInit.push(resolve))
    }
  }

  static get base(): string {
    return Router.config.base + (Router.config.hashbang ? '/#!' : '')
  }

  public static setConfig(config: RouterConfig): typeof Router {
    Object.assign(Router.config, config)
    return this
  }

  public static use(...fns: Middleware[]): typeof Router {
    Router.middleware.push(...fns)
    return this
  }

  public static usePlugin(...fns: RoutePlugin[]): typeof Router {
    log.warn('Router.usePlugin() is deprecated. Use Route.usePlugin().')
    Route.usePlugin(...fns)
    return this
  }

  public static useRoutes(routes: RouteMap | Route[]): typeof Router {
    if (Array.isArray(routes)) {
      Router.routes.push(...routes)
    } else {
      Router.routes.push(
        ...Object.keys(routes).map(
          (path) => new Route(path, ...castArray(routes[path]))
        )
      )
    }
    return this
  }

  public static get(i: number): Router {
    let router = Router.head
    while (i-- > 0) {
      if (!router.ctx.$child) {
        throw new Error(
          // tslint:disable-next-line:max-line-length
          `[@profiscience/knockout-contrib-router] Router.get(${i}) is out of bounds (there are currently only ${
            i + i
          } routers active (indicies are zero-based)`
        )
      }
      router = router.ctx.$child.router
    }
    return router
  }

  public static async update(
    url: string,
    _args?: boolean | RouterUpdateOptions
  ): Promise<boolean> {
    return await Router.head.update(url, _args)
  }

  public static getPathFromLocation(): string {
    const path = location.pathname + location.search + location.hash
    const baseWithOrWithoutHashbangRegexp = Router.config.base.replace(
      '#!',
      '#?!?'
    )
    return path.replace(
      new RegExp(`^${baseWithOrWithoutHashbangRegexp}`, 'i'),
      ''
    )
  }

  private static onclick(e: MouseEvent) {
    const el = getAnchor(e.target as Node)

    if (e.defaultPrevented || !el) {
      return
    }

    const { pathname, search, hash = '' } = el
    const path = (pathname + search + hash).replace(
      new RegExp(`^${Router.base}`, 'i'),
      ''
    )

    const isValidRoute = Router.hasRoute(path)
    const isCrossOrigin = !Router.sameOrigin(el.href)
    const isDoubleClick = Router.which(e) !== 1
    const isDownload = el.hasAttribute('download')
    const isEmptyHash = el.getAttribute('href') === '#'
    const isMailto = (el.getAttribute('href') || '').indexOf('mailto:') === 0
    const hasExternalRel = el.getAttribute('rel') === 'external'
    const hasModifier = e.metaKey || e.ctrlKey || e.shiftKey
    const hasOtherTarget = el.hasAttribute('target')

    if (
      !isValidRoute ||
      isCrossOrigin ||
      isDoubleClick ||
      isDownload ||
      isEmptyHash ||
      isMailto ||
      hasExternalRel ||
      hasModifier ||
      hasOtherTarget
    ) {
      return
    }

    Router.update(path).catch((err) =>
      log.error('Error occurred during navigation', err)
    )
    e.preventDefault()
  }

  private static onpopstate(e: PopStateEvent) {
    Router.update(Router.getPathFromLocation(), {
      push: false,
      state: e.state,
    }).catch((err) => log.error('Error navigating back', err))
    e.preventDefault()
  }

  private static canonicalizePath(path: string) {
    return path.replace(new RegExp('^/?(?:#!)?/?'), '/')
  }

  private static normalizeUpdateOptions(
    args?: boolean | RouterUpdateOptions
  ): RouterUpdateOptions {
    let options: RouterUpdateOptions
    if (typeof args === 'boolean') {
      options = { push: args as boolean }
    } else if (typeof args === 'undefined') {
      options = {}
    } else {
      options = args
    }
    if (typeof options.push === 'undefined') {
      options.push = true
    }
    if (typeof options.state === 'undefined') {
      options.state = Router.config.preserveHistoryStateOnNavigation
        ? history.state
        : {}
    }
    if (typeof options.with === 'undefined') {
      options.with = {}
    }
    return options
  }

  private static parseUrl(url: string): UrlFragments {
    const parser = document.createElement('a')
    parser.href = Router.canonicalizePath(url)
    return {
      hash: parser.hash,
      path:
        parser.pathname.charAt(0) === '/'
          ? parser.pathname
          : '/' + parser.pathname,
      search: parser.search,
    }
  }

  private static hasRoute(path: string) {
    return (
      typeof Router.head.resolveRoute(Router.parseUrl(path).path) !==
      'undefined'
    )
  }

  private static sameOrigin(href: string) {
    const { hostname, port, protocol } = location
    let origin = protocol + '//' + hostname
    if (port) {
      origin += ':' + port
    }
    return href && href.indexOf(origin) === 0
  }

  private static which(e: MouseEvent): number {
    e = e || (window.event as MouseEvent) // tslint:disable-line deprecation
    return e.which === null ? e.button : e.which // tslint:disable-line strict-type-predicates deprecation
  }
}
