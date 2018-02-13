import * as ko from 'knockout'
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'
import { RestApiHelper, RestHelperRequestConfig } from './helper'

export type RestMixinConfig = RestHelperRequestConfig & {
  baseURL?: string
  stringifyQuery?: (query: { [k: string]: any }) => string
}

export const createRESTMixin = (config: RestMixinConfig = {}) => (controller: string) => {
  const api = new RestApiHelper({
    ...config,
    baseURL: [config.baseURL, controller]
      .filter((v) => typeof v !== 'undefined')
      .join('/')
  })

  return <P, T extends { new(...args: any[]): DataModelConstructorBuilder<P> }>(ctor: T) => class extends ctor {
    protected api = api

    protected async fetch(initData?: any) {
      return initData || await api.get({ params: this.params })
    }

    public async create() {
      const res = await api.post({ params: this.params, data: this.toJS() })
      await super.save()
      return res
    }

    public async save() {
      const res = await api.put({ params: this.params, data: this.toJS() })
      await super.save()
      return res
    }

    public async delete() {
      const res = await api.delete({ params: this.params })
      await super.delete()
      return res
    }
  }
}
