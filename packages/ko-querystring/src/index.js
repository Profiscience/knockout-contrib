import ko from 'knockout'

const isUndefined = (x) => typeof x === 'undefined'

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
        }
        return query[this._group][name]
      }
    })

    Object.keys(init).forEach((k) => p[k])

    return p
  }

  toJS() {
    return ko.toJS(query[this._group])
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
    const _query = ko.toJS(query)

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
