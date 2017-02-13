import ko from 'knockout'
import { isBool, isEmpty, isNumber, isUndefined, omit } from './utils'

const query = {}
const links = {}

let _parse, _stringify

function getDefaults(config) {
  const defaults = {}
  Object.entries(config).forEach(([k, v]) =>
    defaults[k] = isQueryParamConfigObject(v)
      ? v.default
      : v)
  return defaults
}

function isQueryParamConfigObject(c) {
  return c && (c.default || c.initial || c.coerce)
}

class Query {
  constructor(config = {}, group) {
    this._group = group
    this._config = config
    this._defaults = getDefaults(config)

    if (isUndefined(query[this._group])) {
      query[this._group] = {}
      links[this._group] = 1
    } else {
      links[this._group]++
    }

    const fromQS = Query.fromQS(this._group)

    Object.entries(config).forEach(([name, config]) => {
      Object.defineProperty(this, name, {
        get: () => {
          const init = fromQS[name] || (config && config.initial) || this._defaults[name]
          const coerce = (config && config.coerce) || ((x) => x)

          if (isUndefined(query[this._group][name])) {
            query[this._group][name] = Query.createQuerySetterObservable(group, name, this._defaults[name], init, coerce)
            Object.assign(query[this._group][name], {
              isDefault: ko.pureComputed(() => query[this._group][name]() === this._defaults[name]),
              clear: () => {
                query[this._group][name](this._defaults[name])
              }
            })
            if (this._forceRecompute) {
              ko.tasks.schedule(() => this._forceRecompute(!this._forceRecompute()))
            }
          }
          return query[this._group][name]
        }
      })

      this[name]
    })

    return this
  }

  setDefaults(d) {
    const oldDefaults = JSON.parse(JSON.stringify(this._defaults)) // poor man's clone...
    Object.assign(this._defaults, d)
    Object.keys(d).forEach((k) => {
      if (typeof this[k]() === 'undefined' || this[k]() === oldDefaults[k]) {
        this[k](d[k])
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
    Object.keys(query[this._group]).forEach((k) => query[this._group][k](this._defaults[k]))
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

  static createQuerySetterObservable(group, name, defaultVal, initVal, coerce) {
    const obs = ko.observable(initVal)

    return ko.pureComputed({
      read() {
        return obs()
      },
      write(v) {
        if (isUndefined(v)) {
          v = defaultVal
        }
        if (coerce) {
          v = coerce(v)
        }
        obs(v)
        Query.queueQueryStringWrite()
      }
    })
  }
}

export default Query
