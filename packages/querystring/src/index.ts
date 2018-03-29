import * as ko from 'knockout'
import { Primitive, MaybeArray, isBool, isEmpty, isNumber, isUndefined, entries, omit } from './utils'

export type IQueryParam<T> = KnockoutObservable<any> & {
  isDefault(): boolean
  clear(): void
}

export type IQuery<T> = {
  [P in keyof T]: IQueryParam<T>
}

export interface IQueryParamConfig {
  default: MaybeArray<Primitive>
  initial?: MaybeArray<Primitive>
  coerce?(v: any): MaybeArray<Primitive>
}

export interface IQueryConfig {
  [k: string]: MaybeArray<Primitive> | IQueryParamConfig
}

export interface IParser {
  parse(str: string): { [k: string]: any }
  stringify(obj: { [k: string]: any }): string
}

export default class Query {
  private static readonly _raw = {} as { [k: string]: any }
  private static readonly _refs = {} as { [k: string]: any }
  private static _queuedUpdate: Promise<void> | false
  private static _parser: IParser = {
    parse: (str) => JSON.parse(decodeURIComponent(str || '{}')),
    stringify: (obj) => JSON.stringify(obj) === '{}'
      ? ''
      : encodeURIComponent(JSON.stringify(obj))
  }

  private _group?: string

  [k: string]: any

  constructor(config: IQueryConfig, group?: string) {
    this._group = group as string

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
      this[name] = Query._raw[group][name]

      if (isUndefined(this[name])) {
        const _default = defaults[name]
        const coerce = paramConfig.coerce || ((x: any) => x)
        const init = !isUndefined(fromQS[name]) ? fromQS[name] : paramConfig.initial

        this[name] = Query._raw[group][name] = Query.createQueryParam(group, name, _default, init, coerce)
      } else {
        this[name].set(paramConfig)
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
    const group = this._group as string
    Object.keys(Query._raw[group]).forEach((k) => Query._raw[group][k].clear())
  }

  public dispose() {
    const group = this._group as string
    if (--Query._refs[group] === 0) {
      const current = Object.assign({}, Query.fromQS(), Query.getCleanQuery())
      delete current[group]
      Query.writeQueryString(current)

      delete Query._raw[group]
    }
  }

  public static parse(str: string) {
    return Query._parser.parse(str)
  }

  public static stringify(obj: { [k: string]: MaybeArray<Primitive> }) {
    return Query._parser.stringify(obj)
  }

  public static create<T extends IQueryConfig>(config: T, group?: string): IQuery<T> & Query {
    return new Query(config, group) as any
  }

  public static setParser(parser: IParser) {
    Query._parser = parser
  }

  public static getQueryString() {
    const matches = /\?([^#]*)/.exec(location.search + location.hash)
    return matches
      ? matches[1]
      : ''
  }

  public static fromQS(group?: string) {
    const query = this.parse(this.getQueryString())
    return (isUndefined(group) ? query : query[group as string]) || {}
  }

  private static getCleanQuery() {
    const _query = {} as { [k: string]: any }
    for (const [g, q] of entries(Query._raw)) {
      _query[g] = ko.toJS(omit(q, (v: IQueryParam<any>) =>
        v.isDefault() ||
        isUndefined(v()) ||
        (isEmpty(v()) && !isNumber(v()) && !isBool(v()))
      ))
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
      newUrl = currentUrl.replace(
        /(?:\?[^#]+|$)/,
        qs ? '?' + qs : ''
      )
    } else {
      const matches = /([^?#]*)/.exec(currentUrl)

      if (!matches) {
        throw new Error('[@profiscience/knockout-contrib-querystring] Failed to write updated querystring')
      }

      const currentPathname = matches[1]
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

  private static createQueryParam(
    group: string,
    name: string,
    __default: MaybeArray<Primitive>, // tslint:disable-line variable-name
    init: MaybeArray<Primitive>,
    coerce: (x: any) => MaybeArray<Primitive>
  ) {
    const _default = ko.observable(ko.toJS(__default))
    const _p = ko.observable(isUndefined(init) ? _default() : init)
    const isDefault = ko.pureComputed(() => p() === _default())

    const p = ko.pureComputed({
      read() {
        return _p()
      },
      write(v: MaybeArray<Primitive>) {
        if (isUndefined(v)) {
          v = _default()
        }
        if (coerce) {
          v = coerce(v)
        }
        _p(v as any)
        Query.queueQueryStringWrite()
          // tslint:disable-next-line no-console
          .catch((err) => console.error('[@profiscience/knockout-contrib-querystring] error queueing write'))
      }
    })

    Object.assign(p, {
      isDefault,
      set: (d: IQueryParamConfig | MaybeArray<Primitive>) => {
        if (!this.isParamConfigObject(d)) {
          d = d as MaybeArray<Primitive>
          if (isDefault() || isUndefined(p())) {
            p(d)
          }
          _default(d as any)
        } else {
          d = d as IQueryParamConfig
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

  private static isParamConfigObject(c: any) {
    return c && (c.default || c.initial || c.coerce)
  }

  private static getDefaults(config: IQueryConfig) {
    const defaults = {} as { [k: string]: any }
    entries(config).forEach(([k, v]) =>
      (defaults[k] = this.isParamConfigObject(v)
        ? v.default
        : v))
    return defaults
  }
}
