import * as ko from 'knockout'
import {
  Primitive,
  MaybeArray,
  isBool,
  isEmpty,
  isNumber,
  isUndefined,
  entries,
  omit
} from './utils'

const VIA_FACTORY = Symbol('VIA_FACTORY')

const instances = new Set<Query>()

let historyApiSpied = false
let replaceState: typeof history.replaceState

export type IQueryParam<T> = ko.PureComputed<T> & {
  isDefault(): boolean
  clear(): void
  set(v: T | IQueryParamConfig<any>): void
}

export type IQuery<T> = {
  [P in keyof T]: T[P] extends IQueryParamConfig<any>
    ? IQueryParam<T[P]['default']>
    : IQueryParam<T[P]>
}

export interface IQueryParamConfig<T extends MaybeArray<Primitive>> {
  default: T
  initial?: T
  coerce?(v: any): T
  sticky?: boolean
}

export interface IQueryConfig {
  [k: string]: MaybeArray<Primitive> | IQueryParamConfig<any>
}

export interface IQueryParser {
  parse(str: string): { [k: string]: any }
  stringify(obj: { [k: string]: any }): string
}

export class Query {
  private static readonly _raw = {} as { [k: string]: any }
  private static readonly _refs = {} as { [k: string]: any }
  private static _queuedUpdate: Promise<void> | false
  private static _parser: IQueryParser = {
    parse: (str) => JSON.parse(decodeURIComponent(str || '{}')),
    stringify: (obj) =>
      JSON.stringify(obj) === '{}'
        ? ''
        : encodeURIComponent(JSON.stringify(obj))
  }

  private readonly _group!: string
  private readonly _subs: ko.Subscription[] = []

  constructor(config: IQueryConfig, group?: string, isViaFactory?: symbol) {
    instances.add(this)

    if (isViaFactory !== VIA_FACTORY) {
      console.warn(
        '[@profiscience/knockout-contrib] Use the Query.create() factory function instead of `new`'
      )
    }

    if (!historyApiSpied) {
      historyApiSpied = true
      replaceState = spyOnHistoryApiMethod('replaceState')
      spyOnHistoryApiMethod('pushState')
    }

    Object.defineProperty(this, '_group', {
      configurable: false,
      enumerable: false,
      get: () => group
    })

    Object.defineProperty(this, '_subs', {
      configurable: false,
      enumerable: false,
      writable: false
    })

    if (isUndefined(Query._raw[this._group])) {
      Query._raw[this._group] = {}
      Query._refs[this._group] = 1
    } else {
      Query._refs[this._group]++
    }

    // restore querystring on back-button navigation (stored by .dispose() method)
    const state = history.state
    if (state && state.__query && state.__query[this._group]) {
      const current = Object.assign({}, Query.fromQS(), Query.getCleanQuery())
      Query.writeQueryString({
        ...current,
        [this._group]: state.__query[this._group]
      })
      delete state.__query[this._group]
      replaceState(state, document.title, location.href)
    }

    this.set(config)
  }

  public set(config: IQueryConfig) {
    const defaults = Object.assign({}, Query.getDefaults(config))
    const group = this._group
    const fromQS = Query.fromQS(group)
    const localStorageKey = Query.getLocalStorageKey(group)
    const fromLocalStorage = Query.fromLocalStorage(localStorageKey)

    entries(config).forEach(([name, paramConfig = {}]) => {
      const query: Query & IQuery<any> = this as any
      query[name] = Query._raw[group][name]

      if (isUndefined(query[name])) {
        const _default = defaults[name]
        const coerce = paramConfig.coerce || ((x: any) => x)
        const init =
          paramConfig.sticky && !isUndefined(fromLocalStorage[name])
            ? fromLocalStorage[name]
            : !isUndefined(fromQS[name])
            ? fromQS[name]
            : paramConfig.initial

        query[name] = Query._raw[group][name] = Query.createQueryParam(
          _default,
          init,
          coerce
        )

        if (paramConfig.sticky) {
          this._subs.push(
            query[name].subscribe((newVal) => {
              const store = Query.fromLocalStorage(localStorageKey)
              store[name] = newVal
              localStorage.setItem(localStorageKey, JSON.stringify(store))
            })
          )
        }
      } else {
        query[name].set(paramConfig)
      }
    })

    ko.tasks.runEarly()
  }

  public toJS() {
    return omit(ko.toJS(Query._raw[this._group]), isUndefined)
  }

  public toString() {
    return Query.stringify(this.toJS())
  }

  public asObservable() {
    return ko.pureComputed(() => this.toJS())
  }

  public clear() {
    Object.keys(Query._raw[this._group]).forEach((k) =>
      Query._raw[this._group][k].clear()
    )
  }

  public dispose() {
    instances.delete(this)
    const group = this._group
    this._subs.map((s) => s.dispose())
    if (--Query._refs[group] === 0) {
      const current = Object.assign({}, Query.fromQS(), Query.getCleanQuery())
      const state = history.state || {}
      state.__query = state.__query || {}
      state.__query[group] = current[group]
      replaceState(state, document.title, location.href)
      delete current[group]
      Query.writeQueryString(current)
      delete Query._raw[group]
    }
  }

  private reload(fromQS: { [k: string]: any }) {
    if (this._group) fromQS = fromQS[this._group]
    if (fromQS) {
      Object.keys(fromQS).forEach((k) => {
        const v = fromQS[k]
        const query = this as any
        if (ko.isObservable(query[k])) {
          query[k](v)
        }
      })
    }
  }

  public static parse(str: string) {
    return Query._parser.parse(str)
  }

  public static stringify(obj: { [k: string]: MaybeArray<Primitive> }) {
    return Query._parser.stringify(obj)
  }

  public static create<T extends IQueryConfig>(
    config: T,
    group?: string
  ): IQuery<T> & Query {
    // use an internal symbol to ensure that the factory function is used
    // (and can't be faked). If the constructo is used directly, type-checking
    // will suffer.
    return new Query(config, group, VIA_FACTORY) as any
  }

  public static reload() {
    const fromQS = Query.fromQS()
    for (const i of instances.values()) i.reload(fromQS)
  }

  public static setParser(parser: IQueryParser) {
    Query._parser = parser
  }

  public static getQueryString() {
    const matches = /\?([^#]*)/.exec(location.search + location.hash)
    return matches ? matches[1] : ''
  }

  public static fromQS(group?: string) {
    const query = this.parse(this.getQueryString())
    return (isUndefined(group) ? query : query[group as string]) || {}
  }

  public static fromLocalStorage(key: string) {
    const raw = localStorage.getItem(key)
    if (typeof raw === 'string') {
      try {
        return JSON.parse(raw)
      } catch {
        return {}
      }
    } else {
      return {}
    }
  }

  private static getLocalStorageKey(group?: string) {
    let key = 'knockout_contrib_query'
    if (group) key += `/${group}`
    return key
  }

  private static getCleanQuery() {
    const _query = {} as { [k: string]: any }
    for (const [g, q] of entries(Query._raw)) {
      _query[g] = ko.toJS(
        omit(
          q,
          (v: IQueryParam<any>) =>
            v.isDefault() ||
            isUndefined(v()) ||
            (isEmpty(v()) && !isNumber(v()) && !isBool(v()))
        )
      )
    }

    const group: string = undefined as any
    if (_query[group]) {
      Object.assign(_query, _query[group])
      delete _query[group]
    }
    return _query
  }

  private static writeQueryString(_query?: any) {
    if (!_query) {
      _query = this.getCleanQuery()
    }

    const qs = Query.stringify(_query)

    const currentUrl = location.pathname + location.search + location.hash
    const hashbang = currentUrl.includes('#!')
    let newUrl

    if (hashbang) {
      newUrl = currentUrl.replace(/(?:\?[^#]+|$)/, qs ? '?' + qs : '')
    } else {
      const pathnameMatches = /([^?#]*)/.exec(currentUrl)
      if (!pathnameMatches) {
        throw new Error(
          'Failed to write query string; could not parse current url'
        )
      }
      const currentPathname = pathnameMatches[1]
      const hashMatches = /(#[^!]*)/.exec(currentUrl)

      newUrl = currentPathname

      if (qs) {
        newUrl += '?' + qs
      }

      if (hashMatches) {
        newUrl += hashMatches[1]
      }
    }

    replaceState(history.state, document.title, newUrl)
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

  private static createQueryParam<T extends MaybeArray<Primitive>>(
    __default: T,
    init: T,
    coerce: (x: any) => T
  ): IQueryParam<T> {
    const _default = ko.observable<T>(ko.toJS(__default) as T)
    const _p = ko.observable(_default())
    const isDefault = ko.pureComputed(() => p() === _default())

    const p = ko.pureComputed<T>({
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
        Query.queueQueryStringWrite().catch((err) =>
          console.error(
            '[@profiscience/knockout-contrib-querystring] error queueing write',
            err
          )
        )
      }
    }) as IQueryParam<T>

    Object.assign(p, {
      isDefault,
      set: (d: IQueryParamConfig<T> | T) => {
        if (!this.isParamConfigObject(d)) {
          if (isDefault() || isUndefined(p())) {
            p(d as any)
          }
          _default(d as T)
        } else {
          d = d as IQueryParamConfig<T>
          if (d.coerce) {
            coerce = d.coerce
          }
          if (isDefault() || isUndefined(p()) || !isUndefined(d.initial)) {
            p(typeof d.initial !== 'undefined' ? d.initial : d.default)
          }
          if (d.default) {
            _default(d.default)
          }
        }
      },
      clear: () => p(_default())
    })

    if (!isUndefined(init)) p(init)

    return p
  }

  private static isParamConfigObject(c: any) {
    return c && c.hasOwnProperty('default')
  }

  private static getDefaults(config: IQueryConfig) {
    const defaults = {} as { [k: string]: any }
    entries(config).forEach(
      ([k, v]) => (defaults[k] = this.isParamConfigObject(v) ? v.default : v)
    )
    return defaults
  }
}

function spyOnHistoryApiMethod(methodName: string) {
  const h: any = history
  const orig = h[methodName].bind(h)
  h[methodName] = (...args: any[]) => {
    const ret = orig(...args)
    Query.reload()
    return ret
  }
  return orig
}
