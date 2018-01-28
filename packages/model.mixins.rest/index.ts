// tslint:disable max-classes-per-file

import * as ko from 'knockout'
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'

export type RestMixinConfig = RestMixinRequestConfig & {
  baseURL?: string
  stringifyQuery?: (query: { [k: string]: any }) => string
}

export type RestMixinRequestConfig = {
  headers?: { [k: string]: string }
  cors?: boolean
  authenticated?: boolean
}

export type RestMixinFetchOptions = {
  params?: { [k: string]: any }
}

export type RestMixinUpdateRequestOptions = {
  params?: { [k: string]: any }
  data?: { [k: string]: any }
}

export type RestMixinApiFetchHelperMethod = {
  (opts?: RestMixinFetchOptions): Promise<any>
  (endpoint?: string, opts?: RestMixinFetchOptions): Promise<any>
}

export type RestMixinApiUpdateHelperMethod = {
  (opts?: RestMixinUpdateRequestOptions): Promise<any>
  (endpoint?: string, opts?: RestMixinUpdateRequestOptions): Promise<any>
}

class RestApi {
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
    return Object.keys(ko.toJS(query)).map(encode).join('&')
  }
}

export class RestApiError extends Error {
  constructor(public response: Response) {
    super(response.statusText)
  }
}

export function createRESTMixin(pluginConfig: RestMixinConfig = {}) {
  return (controller: string, controllerConfig: RestMixinConfig = {}) => {
    return <P, T extends { new(...args: any[]): DataModelConstructorBuilder<P> }>(ctor: T) => class extends ctor {
      protected api = new RestApi({
        ...pluginConfig,
        ...controllerConfig,
        baseURL: [pluginConfig.baseURL, controllerConfig.baseURL]
          .filter((v) => typeof v !== 'undefined')
          .join('/')
      })

      protected fetch() {
        return this.api.get({ params: this.params })
      }

      public async save() {
        const res = await this.api.post({ params: this.params, data: this.toJS() })
        await super.save()
        return res
      }

      public async delete() {
        const res = await this.api.delete({ params: this.params })
        await super.delete()
        return res
      }
    }
  }
}
