import * as ko from 'knockout'
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'
import { RestApiHelper } from './helper'

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

export function createRESTMixin(pluginConfig: RestMixinConfig = {}) {
  return (controller: string, controllerConfig: RestMixinConfig = {}) => {
    return <P, T extends { new(...args: any[]): DataModelConstructorBuilder<P> }>(ctor: T) => class extends ctor {
      protected api = new RestApiHelper({
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
