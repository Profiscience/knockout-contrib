import ko from 'knockout'
import qs from 'qs'
import Context from './context'
import Route from './route'
import { isUndefined, normalizePath } from './utils'

const clickEvent = (!isUndefined(document)) && document.ontouchstart
  ? 'touchstart'
  : 'click'

class Router {
  constructor(el, bindingCtx, {
    routes,
    base = '',
    hashbang = false,
    inTransition = noop,
    outTransition = noop,
    persistState = false,
    persistQuery = false,
    queryParser = qs.parse,
    queryStringifier = qs.stringify
  }) {
    for (const route in routes) {
      routes[route] = new Route(route, routes[route])
    }

    this.config = {
      el,
      base,
      hashbang,
      routes,
      inTransition,
      outTransition,
      persistState,
      persistQuery,
      queryParser,
      queryStringifier
    }

    this.ctx = new Context(bindingCtx, this.config)

    const isRoot = isUndefined(this.ctx.$parent)

    this.onclick = this.onclick.bind(this)
    this.onpopstate = this.onpopstate.bind(this)
    document.addEventListener(clickEvent, this.onclick, false)
    if (isRoot) {
      window.addEventListener('popstate', this.onpopstate, false)
    }

    let dispatch = true
    if (!isRoot) {
      dispatch = this.ctx.$parent.path() !== this.ctx.$parent.canonicalPath()
    }

    if (dispatch) {
      const path = (this.config.hashbang && ~location.hash.indexOf('#!'))
        ? location.hash.substr(2) + location.search
        : location.pathname + location.search + location.hash

      let state = false
      let query = false

      if (!isRoot) {
        state = this.ctx.$parent._$childInitState
        query = this.ctx.$parent._$childInitQuery
        delete this.ctx.$parent._$childInitState
        delete this.ctx.$parent._$childInitQuery
      }

      this.ctx._update(path, state, false, query)
    }
  }

  onpopstate(e) {
    if (e.defaultPrevented) {
      return
    }

    const path = location.pathname + location.search + location.hash
    const state = (e.state || {})[normalizePath(this.ctx.config.depth + this.ctx.pathname())]

    if (this.ctx._update(path, state, false)) {
      e.preventDefault()
    }
  }

  onclick(e) {
    // ensure link
    let el = e.target
    while (el && 'A' !== el.nodeName) {
      el = el.parentNode
    }
    if (!el || 'A' !== el.nodeName) {
      return
    }

    const isDoubleClick = 1 !== which(e)
    const hasModifier = e.metaKey || e.ctrlKey || e.shiftKey
    const isDownload = el.hasAttribute('download')
    const hasOtherTarget = el.hasAttribute('target')
    const hasExternalRel = el.getAttribute('rel') === 'external'
    const isMailto = ~(el.getAttribute('href') || '').indexOf('mailto:')
    const isCrossOrigin = !sameOrigin(el.href)
    const isEmptyHash = el.getAttribute('href') === '#'

    if (isCrossOrigin ||
        isDoubleClick ||
        isDownload ||
        isEmptyHash ||
        isMailto ||
        hasExternalRel ||
        hasModifier ||
        hasOtherTarget) {
      return
    }

    const path = el.pathname + el.search + (el.hash || '')

    if (this.ctx._update(path)) {
      e.preventDefault()
    }
  }

  dispose() {
    document.removeEventListener(clickEvent, this.onclick, false)
    window.removeEventListener('popstate', this.onpopstate, false)
    this.ctx.destroy()
  }
}

function createViewModel(routerParams, componentInfo) {
  const el = componentInfo.element
  const bindingCtx = ko.contextFor(el)
  return new Router(el, bindingCtx, ko.toJS(routerParams))
}

function which(e) {
  e = e || window.event
  return null === e.which ? e.button : e.which
}

function noop() {}

function sameOrigin(href) {
  let origin = location.protocol + '//' + location.hostname
  if (location.port) origin += ':' + location.port
  return (href && (0 === href.indexOf(origin)))
}

export default { createViewModel }
