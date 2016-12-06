import ko from 'knockout'
import { isEmpty, isUndefined, omit } from './utils'

const query = {}

export default class Query {
  constructor(defaults = {}, group) {
    this._group = group
    this._defaults = defaults

    if (isUndefined(query[this._group])) {
      query[this._group] = {}
    }

    let fromQS = Query.parse(Query.getQueryString())
    if (!isUndefined(group)) {
      fromQS = fromQS[group]
    }

    const init = Object.assign(
      {},
      defaults,
      fromQS)

    const p = new Proxy(this, {
      get: (_, name) => {
        if (name[0] === '_' || !isUndefined(this[name])) {
          return this[name]
        }
        if (isUndefined(query[this._group][name])) {
          const d = this._defaults[name]
          query[this._group][name] = Query.createQuerySetterObservable(group, name, d, init[name])
          Object.assign(query[this._group][name], {
            isDefault: ko.pureComputed(() => query[this._group][name]() === d),
            clear() { query[this._group][name](d) }
          })
        }
        return query[this._group][name]
      }
    })

    Object.keys(init).forEach((k) => p[k])

    return p
  }

  setDefaults(d) {
    const oldDefaults = JSON.parse(JSON.stringify(this._defaults)) // poor man's clone...
    Object.assign(this._defaults, d)
    Object.keys(d).forEach((k) => {
      if (typeof this[k]() === 'undefined' || this[k]() === oldDefaults[k]) {
        this[k](d[k])
      }
    })
  }

  toJS() {
    return omit(ko.toJS(query[this._group]), isUndefined)
  }

  asObservable() {
    return ko.pureComputed(() => this.toJS())
  }

  clear() {
    Object.keys(query[this._group]).forEach((k) => query[this._group][k](this._defaults[k]))
  }

  dispose() {
    delete query[this._group]
    Query.queueQueryStringWrite()
  }

  static parse(str) {
    return JSON.parse(decodeURIComponent(str || '{}'))
  }

  static stringify(obj) {
    const json = JSON.stringify(obj)
    return json === '{}'
      ? ''
      : encodeURIComponent(JSON.stringify(obj))
  }

  static getQueryString() {
    const matches = /\?([^#]*)/.exec(location.search + location.hash)
    return matches
      ? matches[1]
      : ''
  }

  static writeQueryString() {
    const _query = {}

    for (const [g, q] of Object.entries(query)) {
      _query[g] = ko.toJS(omit(q, (v) => isUndefined(v()) || isEmpty(v()) || v.isDefault()))
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
    if (this._updateQueued) {
      return
    }
    ko.tasks.schedule(() => {
      Query.writeQueryString()
      this._updateQueued = false
    })
    this._updateQueued = true
  }

  static createQuerySetterObservable(group, name, defaultVal, initVal) {
    const obs = ko.observable(initVal)

    return ko.pureComputed({
      read() {
        return obs()
      },
      write(v) {
        if (isUndefined(v)) {
          v = defaultVal
        }
        obs(v)
        Query.queueQueryStringWrite()
      }
    })
  }
}
