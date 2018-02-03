import * as ko from 'knockout'
import { RestMixinConfig } from './mixin'

export type RestHelperRequestConfig = {
  headers?: { [k: string]: string }
  cors?: boolean
  authenticated?: boolean
}

export type RestHelperFetchOptions = {
  params?: { [k: string]: any }
}

export type RestHelperUpdateOptions = {
  params?: { [k: string]: any }
  data?: { [k: string]: any }
}

export type RestHelperFetchMethod = {
  (opts?: RestHelperFetchOptions): Promise<any>
  (endpoint?: string, opts?: RestHelperFetchOptions): Promise<any>
}

export type RestHelperUpdateMethod = {
  (opts?: RestHelperUpdateOptions): Promise<any>
  (endpoint?: string, opts?: RestHelperUpdateOptions): Promise<any>
}

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

  public get: RestHelperFetchMethod = this.createRequestMethod('GET')
  public post: RestHelperUpdateMethod = this.createRequestMethod('POST')
  public put: RestHelperUpdateMethod = this.createRequestMethod('PUT')
  public patch: RestHelperUpdateMethod = this.createRequestMethod('PATCH')
  public delete: RestHelperUpdateMethod = this.createRequestMethod('DELETE')

  /* istanbul ignore next */
  public download(endpoint: string, opts: RestHelperUpdateOptions = {}) {
    let url = this.baseURL + endpoint
    if (opts.params) {
      url += this.stringifyQuery(opts.params)
    }
    window.location.href = url
  }

  private createRequestMethod(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE') {
    return async (arg1: any = {}, arg2: any = {}) => {
      let endpoint: string
      let opts: RestHelperFetchOptions & RestHelperUpdateOptions

      if (typeof arg1 === 'string') {
        endpoint = arg1
        opts = arg2
      } else {
        endpoint = ''
        opts = arg1
      }

      const requestInit = { ...this.requestInit, method }

      const url = this.constructUrl(endpoint, opts.params)

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

  private constructUrl(endpoint: string, params: { [k: string]: any } = {}) {
    // handle full url, https://example.com/api/endpoint/:param?
    const queryParams: Set<string> = new Set(Object.keys(params))
    let url = this.baseURL + endpoint.replace(/^\/?(.+)$/, '/$1') // replace leading double /

    const pattern = /(:?)([^/?]+)(\??)/g
    let match: RegExpExecArray | null
    while ((match = pattern.exec(url)) !== null) { // tslint:disable-line no-conditional-assignment
      const [_, isInterpolated, name, isOptional] = match
      if (!isOptional && !params[name]) continue
      if (isInterpolated) {
        let textToReplace = ':' + name
        if (isOptional) textToReplace += '?'
        url = url.replace(textToReplace, params[name] || '')
        queryParams.delete(name)
      } else if (isOptional) {
        url = url.replace(name + '?', params[name] ? name : '')
        queryParams.delete(name)
      }
    }

    if (queryParams.size > 0) {
      const query = Array.from(queryParams).reduce((accum, p) => ({ ...accum, [p]: params[p] }), {})
      url += '?' + this.stringifyQuery(query)
    }

    return url
  }

  private stringifyQuery(query: { [k: string]: any } = {}): string {
    const encode = (k: string) => {
      const v = query[k]
      return Array.isArray(v)
        ? v.map((vi) => `${k}[]=${encodeURIComponent(vi)}`)
        : [`${k}=${encodeURIComponent(v)}`]
    }
    const flatten = (accum: string[], v: string[]) => [...accum, ...v]
    return Object.keys(ko.toJS(query)).map(encode).reduce(flatten, []).join('&')
  }
}

// tslint:disable-next-line max-classes-per-file
export class RestApiError extends Error {
  constructor(public response: Response) {
    super(response.statusText)
  }
}
