import * as ko from 'knockout'
import { isBool, isEmpty, isNumber, isUndefined, entries, omit } from './utils'

const query = {}
const links = {}

let _parse, _stringify

function getDefaults(config) {
  const defaults = {}
  entries(config).forEach(([k, v]) =>
    (defaults[k] = isQueryParamConfigObject(v)
      ? v.default
      : v))
  return defaults
}

function isQueryParamConfigObject(c) {
  return c && (c.default || c.initial || c.coerce)
}

type IQuery<T> = {
  [P in keyof T]: KnockoutObservable<any> | KnockoutObservableArray<any>
}

export class Query {
  private static _queuedUpdate: Promise<void> | false

  private _group?: string
  private _config?: any // @todo
  private _defaults?: { [k: string]: any }
  private _forceRecompute?: KnockoutObservable<boolean>

  constructor(config: any, group?: string) {
    this._group = group

    if (isUndefined(query[this._group])) {
      query[this._group] = {}
      links[this._group] = 1
    } else {
      links[this._group]++
    }

    this.set(config)
  }

  public set(config) {
    this._config = config
    this._defaults = Object.assign({}, this._defaults || {}, getDefaults(config))
    const group = this._group
    const fromQS = Query.fromQS(group)

    entries(config).forEach(([name, config = {}]) => {
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

  public toJS() {
    return omit(ko.toJS(query[this._group]), isUndefined)
  }

  public toString() {
    return Query.stringify(this.toJS())
  }

  public asObservable() {
    if (!this._forceRecompute) {
      this._forceRecompute = ko.observable(false)
    }

    return ko.pureComputed(() => {
      this._forceRecompute()
      return this.toJS()
    })
  }

  public clear() {
    Object.keys(query[this._group]).forEach((k) => query[this._group][k].clear())
  }

  public dispose() {
    if (--links[this._group] === 0) {
      const current = Object.assign({}, Query.fromQS(), Query.getCleanQuery())
      delete current[this._group]
      Query.writeQueryString(current)

      delete query[this._group]
    }
  }

  private static get defaultParser() {
    return {
      parse: (str) => JSON.parse(decodeURIComponent(str || '{}')),
      stringify: (obj) => JSON.stringify(obj) === '{}'
          ? ''
          : encodeURIComponent(JSON.stringify(obj))
    }
  }

  public static get parse() {
    return _parse || this.defaultParser.parse
  }

  public static get stringify() {
    return _stringify || this.defaultParser.stringify
  }

  public static create<T>(config: T): IQuery<T> & Query {
    return new Query(config) as any
  }

  private static setParser(parser) {
    _parse = parser.parse
    _stringify = parser.stringify
  }

  public static getQueryString() {
    const matches = /\?([^#]*)/.exec(location.search + location.hash)
    return matches
      ? matches[1]
      : ''
  }

  public static fromQS(group?: string) {
    const query = this.parse(this.getQueryString())
    return (isUndefined(group) ? query : query[group]) || {}
  }

  private static getCleanQuery() {
    const _query = {}
    for (const [g, q] of entries(query)) {
      _query[g] = ko.toJS(omit(q, (v) =>
        v.isDefault() ||
        isUndefined(v()) ||
        (isEmpty(v()) && !isNumber(v()) && !isBool(v()))))
    }

    if (_query[undefined as string]) {
      Object.assign(_query, _query[undefined as string])
      delete _query[undefined as string]
    }
    return _query
  }

  private static writeQueryString(_query?: any) {
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

  private static queueQueryStringWrite() {
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

  private static createQueryParam(group, name, __default, init, coerce) {
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