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

export type IQueryParam<T> = ko.Computed<T> & {
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

  constructor(config: IQueryConfig, group?: string, isViaFactory?: symbol) {
    instances.add(this)

    if (isViaFactory !== VIA_FACTORY) {
      // tslint:disable-next-line:no-console
      console.warn(
        '[@profiscience/knockout-contrib] Use the Query.create() factory function instead of `new`'
      )
    }

    if (!historyApiSpied) {
      spyOnHistoryApi()
      historyApiSpied = true
    }

    Object.defineProperty(this, '_group', {
      enumerable: false,
      get: () => group
    })

    if (isUndefined(Query._raw[this._group])) {
      Query._raw[this._group] = {}
      Query._refs[this._group] = 1
    } else {
      Query._refs[this._group]++
    }

    this.set(config)
  }

  public set(config: IQueryConfig) {
    const defaults = Object.assign({}, Query.getDefaults(config))
    const group = this._group as string
    const fromQS = Query.fromQS(group)

    entries(config).forEach(([name, paramConfig = {}]) => {
      const query: Query & IQuery<any> = this as any
      query[name] = Query._raw[group][name]

      if (isUndefined(query[name])) {
        const _default = defaults[name]
        const coerce = paramConfig.coerce || ((x: any) => x)
        const init = !isUndefined(fromQS[name])
          ? fromQS[name]
          : paramConfig.initial

        query[name] = Query._raw[group][name] = Query.createQueryParam(
          _default,
          init,
          coerce
        )
      } else {
        query[name].set(paramConfig)
      }
    })

    ko.tasks.runEarly()
  }

  public toJS() {
    return omit(ko.toJS(Query._raw[this._group as string]), isUndefined)
  }

  public toString() {
    return Query.stringify(this.toJS())
  }

  public asObservable() {
    return ko.pureComputed(() => this.toJS())
  }

  public clear() {
    Object.keys(Query._raw[this._group as string]).forEach((k) =>
      Query._raw[this._group as string][k].clear()
    )
  }

  public dispose() {
    instances.delete(this)
    const group = this._group as string
    if (--Query._refs[group] === 0) {
      const current = Object.assign({}, Query.fromQS(), Query.getCleanQuery())
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
    const hashbang = currentUrl.indexOf('#!') > -1
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

  private static createQueryParam<T extends MaybeArray<Primitive>>(
    __default: T, // tslint:disable-line variable-name
    init: T,
    coerce: (x: any) => T
  ): IQueryParam<T> {
    const _default = ko.observable(ko.toJS(__default))
    const _p = ko.observable(isUndefined(init) ? _default() : init)
    const isDefault = ko.pureComputed(() => p() === _default())

    const p: IQueryParam<T> = ko.pureComputed({
      read() {
        return _p()
      },
      write(v: MaybeArray<T>) {
        if (isUndefined(v)) {
          v = _default()
        }
        if (coerce) {
          v = coerce(v)
        }
        _p(v as string)
        Query.queueQueryStringWrite().catch((err) =>
          // tslint:disable-next-line:no-console
          console.error(
            '[@profiscience/knockout-contrib-querystring] error queueing write',
            err
          )
        )
      }
    }) as any

    Object.assign(p, {
      isDefault,
      set: (d: IQueryParamConfig<T> | MaybeArray<T>) => {
        if (!this.isParamConfigObject(d)) {
          d = d as MaybeArray<T>
          if (isDefault() || isUndefined(p())) {
            p(d as any)
          }
          _default(d as string)
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

    return p
  }

  private static isParamConfigObject(c: any) {
    return c && (c.default || c.initial || c.coerce)
  }

  private static getDefaults(config: IQueryConfig) {
    const defaults = {} as { [k: string]: any }
    entries(config).forEach(
      ([k, v]) => (defaults[k] = this.isParamConfigObject(v) ? v.default : v)
    )
    return defaults
  }
}

function spyOnHistoryApi() {
  spyOnHistoryApiMethod('pushState')
  spyOnHistoryApiMethod('replaceState')
}

function spyOnHistoryApiMethod(methodName: string) {
  const h: any = history
  const orig = h[methodName].bind(h)
  h[methodName] = (...args: any[]) => {
    const ret = orig(...args)
    Query.reload()
    return ret
  }
}
