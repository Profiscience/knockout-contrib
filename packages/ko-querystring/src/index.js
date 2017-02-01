import ko from 'knockout'
import { isBool, isEmpty, isNumber, isUndefined, omit } from './utils'

const query = {}
const links = {}

let _parse, _stringify

function getDefaults(config) {
  const ret = {}
  Object.entries(config).forEach(([k, v]) => ret[k] = v.default)
  return ret
}

function getInitialValues(config) {
  const ret = {}
  Object.entries(config).forEach(([name, { initial }]) => {
    if (initial) {
      ret[name] = initial
    }
  })
  return ret
}

function getSessionValues(config, group) {
  return getBrowserStorageValues(config, group, sessionStorage)
}

function getLocalValues(config, group) {
  return getBrowserStorageValues(config, group, localStorage)
}

function getBrowserStorageValues(config, group, store) {
  const ret = {}
  Object.keys(config).forEach((name) => {
    const browserStorageKey = getBrowserStorageKey(name, group)
    const fromSession = store.getItem(browserStorageKey)
    if (fromSession) {
      ret[name] = fromSession
    }
  })
  return ret
}

function getBrowserStorageKey(name, group) {
  let key = '_KO_QUERYSTRING_'
  if (group) {
    key += group + '_'
  }
  key += name
  return key
}

function expandConfig(c) {
  const ret = {}
  Object.entries(c).forEach(([k, v]) => {
    ret[k] = v.default || v.initial || v.coerce || v.session || v.local
      ? v
      : { default: v }
    })
  return ret
}

class Query {
  constructor(config = {}, group) {
    config = expandConfig(config)

    if (isUndefined(query[group])) {
      query[group] = {}
      links[group] = 1
    } else {
      links[group]++
    }

    this._group = group
    this._defaults = getDefaults(config)

    const initials = Object.assign(
      {},
      this._defaults,
      getInitialValues(config),
      getSessionValues(config, group),
      getLocalValues(config, group),
      Query.fromQS(group))

    const { proxy, revoke } = Proxy.revocable(this, {
      get: (_, name) => {
        if (name[0] === '_' || !isUndefined(this[name])) {
          return this[name]
        }
        if (isUndefined(query[group][name])) {
          const _config = config[name] || {}
          query[group][name] = Query.createQuerySetterObservable({
            group,
            name,
            default: this._defaults[name],
            initial: initials[name],
            coerce: _config.coerce,
            session: _config.session,
            local: _config.local
          })
          Object.assign(query[group][name], {
            isDefault: ko.pureComputed(() => query[group][name]() === this._defaults[name]),
            clear: () => {
              query[group][name](this._defaults[name])
            }
          })
          if (this._forceRecompute) {
            ko.tasks.schedule(() => this._forceRecompute(!this._forceRecompute()))
          }
        }
        return query[group][name]
      }
    })

    this.revoke = revoke

    Object.keys(initials).forEach((k) => proxy[k])

    return proxy
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
      delete query[this._group]
      Query.writeQueryString()
    }
    this.revoke()
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
    return isUndefined(group) ? query : query[group]
  }

  static writeQueryString() {
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

  static createQuerySetterObservable({
    group,
    name,
    default: _default,
    initial,
    coerce,
    session,
    local
  }) {
    const obs = ko.observable(initial)
    const key = getBrowserStorageKey(name, group)

    if (session) {
      sessionStorage.setItem(key, initial)
    } else if (local) {
      localStorage.setItem(key, initial)
    }

    return ko.pureComputed({
      read() {
        return obs()
      },
      write(v) {
        if (isUndefined(v)) {
          v = _default
        }
        if (coerce) {
          v = coerce(v)
        }
        obs(v)
        Query.queueQueryStringWrite()

        if (session) {
          sessionStorage.setItem(key, v)
        } else if (local) {
          localStorage.setItem(key, v)
        }
      }
    })
  }
}

export default Query
