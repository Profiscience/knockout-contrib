import * as ko from 'knockout'
import {
  RestMixinConfig,
  RestMixinApiFetchHelperMethod,
  RestMixinApiUpdateHelperMethod,
  RestMixinFetchOptions,
  RestMixinUpdateRequestOptions
} from './mixin'

export class RestApiHelper {
  private baseURL = ''
  private requestInit: RequestInit = {
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-cache',
    redirect: 'follow'
  }

  constructor(config: RestMixinConfig) {
    if (config.baseURL) {
      this.baseURL = config.baseURL
    }
    if (config.stringifyQuery) {
      this.stringifyQuery = config.stringifyQuery
    }
    if (config.headers) {
      Object.assign(this.requestInit.headers, config.headers)
    }
    if (config.cors) {
      this.requestInit.mode = 'cors'
    }
    if (config.authenticated) {
      this.requestInit.credentials = config.cors ? 'include' : 'same-origin'
    }
  }

  public get: RestMixinApiFetchHelperMethod = this.createRequestMethod('GET')
  public post: RestMixinApiUpdateHelperMethod = this.createRequestMethod('POST')
  public put: RestMixinApiUpdateHelperMethod = this.createRequestMethod('PUT')
  public patch: RestMixinApiUpdateHelperMethod = this.createRequestMethod('PATCH')
  public delete: RestMixinApiUpdateHelperMethod = this.createRequestMethod('DELETE')

  /* istanbul ignore next */
  public download(endpoint: string, opts: RestMixinUpdateRequestOptions = {}) {
    let url = this.baseURL + endpoint
    if (opts.params) {
      url += this.stringifyQuery(opts.params)
    }
    window.location.href = url
  }

  private createRequestMethod(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE') {
    return async (arg1: any = {}, arg2: any = {}) => {
      let endpoint: string
      let opts: RestMixinFetchOptions & RestMixinUpdateRequestOptions

      if (typeof arg1 === 'string') {
        endpoint = arg1
        opts = arg2
      } else {
        endpoint = ''
        opts = arg1
      }

      const requestInit = { ...this.requestInit } // clone
      let url = this.baseURL + endpoint

      if (opts.params) {
        url += '?' + this.stringifyQuery(opts.params)
      }

      if (method !== 'GET' && typeof opts.data !== 'undefined') {
        requestInit.body = ko.toJSON(opts.data)
      }

      const res = await fetch(url, requestInit)

      if (res.status < 200 || res.status >= 300) {
        throw new RestApiError(res)
      }

      return await res.json()
    }
  }

  private stringifyQuery(query: { [k: string]: any } = {}): string {
    const encode = (k: string) => {
      const v = query[k]
      return Array.isArray(v)
        ? v.map((vi) => `${k}[]=${encodeURIComponent(vi)}`)
        : [`${k}=${encodeURIComponent(v)}`]
    }
    const flatten = (accum, v) => [...accum, ...v]
    return Object.keys(ko.toJS(query)).map(encode).reduce(flatten).join('&')
  }
}

// tslint:disable-next-line max-classes-per-file
export class RestApiError extends Error {
  constructor(public response: Response) {
    super(response.statusText)
  }
}
