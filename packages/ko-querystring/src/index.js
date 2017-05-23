import ko from 'knockout'
import { isBool, isEmpty, isNumber, isUndefined, omit } from './utils'

const query = {}
const links = {}

let _parse, _stringify

function getDefaults(config) {
  const defaults = {}
  Object.entries(config).forEach(([k, v]) =>
    (defaults[k] = isQueryParamConfigObject(v)
      ? v.default
      : v))
  return defaults
}

function isQueryParamConfigObject(c) {
  return c && (c.default || c.initial || c.coerce)
}

class Query {
  constructor(config, group) {
    this._group = group

    if (isUndefined(query[this._group])) {
      query[this._group] = {}
      links[this._group] = 1
    } else {
      links[this._group]++
    }

    this.set(config)
  }

  set(config) {
    this._config = config
    this._defaults = Object.assign({}, this._defaults || {}, getDefaults(config))
    const group = this._group
    const fromQS = Query.fromQS(group)

    Object.entries(config).forEach(([name, config = {}]) => {
      this[name] = query[group][name]

      if (isUndefined(this[name])) {
        const _default = this._defaults[name]
        const coerce = config.coerce || ((x) => x)
        const init = !isUndefined(fromQS[name]) ? fromQS[name] : config.initial

        this[name] = query[group][name] = Query.createQueryParam(group, name, _default, init, coerce)
      } else {
        this[name].set(config)
      }
    })

    ko.tasks.runEarly()
  }

  toJS() {
    return omit(ko.toJS(query[this._group]), isUndefined)
  }

  toString() {
    return Query.stringify(this.toJS())
  }

  asObservable() {
    if (!this._forceRecompute) {
      this._forceRecompute = ko.observable(false)
    }

    return ko.pureComputed(() => {
      this._forceRecompute()
      return this.toJS()
    })
  }

  clear() {
    Object.values(query[this._group]).forEach((p) => p.clear())
  }

  dispose() {
    if (--links[this._group] === 0) {
      const current = Object.assign({}, Query.fromQS(), this.constructor.getCleanQuery())
      delete current[this._group]
      Query.writeQueryString(current)

      delete query[this._group]
    }
  }

  static get defaultParser() {
    return {
      parse: (str) => JSON.parse(decodeURIComponent(str || '{}')),
      stringify: (obj) => JSON.stringify(obj) === '{}'
          ? ''
          : encodeURIComponent(JSON.stringify(obj))
    }
  }

  static get parse() {
    return _parse || this.defaultParser.parse
  }

  static get stringify() {
    return _stringify || this.defaultParser.stringify
  }

  static setParser(parser) {
    _parse = parser.parse
    _stringify = parser.stringify
  }

  static getQueryString() {
    const matches = /\?([^#]*)/.exec(location.search + location.hash)
    return matches
      ? matches[1]
      : ''
  }

  static fromQS(group) {
    const query = this.parse(this.getQueryString())
    return (isUndefined(group) ? query : query[group]) || {}
  }

  static getCleanQuery() {
    const _query = {}
    for (const [g, q] of Object.entries(query)) {
      _query[g] = ko.toJS(omit(q, (v) =>
        v.isDefault() ||
        isUndefined(v()) ||
        (isEmpty(v()) && !isNumber(v()) && !isBool(v()))))
    }

    if (_query[undefined]) {
      Object.assign(_query, _query[undefined])
      delete _query[undefined]
    }
    return _query
  }

  static writeQueryString(_query) {
    if (!_query) {
      _query = this.getCleanQuery()
    }

    const qs = Query.stringify(_query)

    const currentUrl = location.pathname + location.search + location.hash
    const currentPathname = /([^?#]*)/.exec(currentUrl)[1]
    const hashMatches = /(#[^!]*)/.exec(currentUrl)

    let newUrl = currentPathname

    if (qs) {
      newUrl += '?' + qs
    }

    if (hashMatches) {
      newUrl += hashMatches[1]
    }

    history.replaceState(history.state, document.title, newUrl)
  }

  static queueQueryStringWrite() {
    if (!this._queuedUpdate) {
      this._queuedUpdate = new Promise((resolve) => {
        ko.tasks.schedule(() => {
          Query.writeQueryString()
          resolve()
          this._queuedUpdate = false
        })
      })
    }

    return this._queuedUpdate
  }

  static createQueryParam(group, name, __default, init, coerce) {
    const _default = ko.observable(ko.toJS(__default))
    const _p = ko.observable(isUndefined(init) ? _default() : init)
    const isDefault = ko.pureComputed(() => p() === _default())

    const p = ko.pureComputed({
      read() {
        return _p()
      },
      write(v) {
        if (isUndefined(v)) {
          v = _default()
        }
        if (coerce) {
          v = coerce(v)
        }
        _p(v)
        Query.queueQueryStringWrite()
      }
    })

    Object.assign(p, {
      isDefault,
      set: (d) => {
        if (!isQueryParamConfigObject(d)) {
          if (isDefault() || isUndefined(p())) {
            p(d)
          }
          _default(d)
        } else {
          if (d.coerce) {
            coerce = d.coerce
          }
          if (isDefault() || isUndefined(p()) || !isUndefined(d.initial)) {
            p(isUndefined(d.initial) ? d.default : d.initial)
          }
          if (d.default) {
            _default(d.default)
          }
        }
      },
      clear: () => p(_default())
    })

    return p
  }
}

export default Query
