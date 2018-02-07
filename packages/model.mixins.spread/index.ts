import * as ko from 'knockout'
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'

export const SPREAD_TOJS_MAPPINGS = Symbol('SPREAD_TOJS_MAPPINGS')

export function SpreadMixin(property: string) {
  return <
    P, T extends { new(...args: any[]): DataModelConstructorBuilder<P> }
    >(ctor: T) => {
    return class extends ctor {
      protected [SPREAD_TOJS_MAPPINGS]: { [k: string]: string[] } = {}

      protected async fetch() {
        const res = await super.fetch()
        if (Array.isArray(res[property])) {
          throw new Error('[@profiscience/knockout-contrib-model-mixins-spread] Can not spread an array onto a model')
        }
        const mappings = Object.keys(res[property])
        this[SPREAD_TOJS_MAPPINGS][property] = mappings
        mappings.forEach((m) => res[m] = res[property][m])
        delete res[property]
        return res
      }

      public toJS() {
        const ret = super.toJS()
        const mappings = this[SPREAD_TOJS_MAPPINGS][property]
        ret[property] = {}
        mappings.forEach((m) => {
          ret[property][m] = ret[m]
          delete ret[m]
        })
        return ret
      }
    }
  }
}
