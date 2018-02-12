import * as ko from 'knockout'
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'

export const SPREAD_MAPPINGS = Symbol('SPREAD_MAPPINGS')

function spread(data: any, property: string) {
  const obj = data[property]
  const keys = Object.keys(obj)
  delete data[property]
  for (const k of keys) {
    data[k] = obj[k]
  }
  return keys
}

export function SpreadMixin(property: string) {
  return <
    P, T extends { new(...args: any[]): DataModelConstructorBuilder<P> }
  >(ctor: T) => {
    return class extends ctor {
      protected [SPREAD_MAPPINGS]: { [k: string]: string[] }

      constructor(...args: any[]) {
        let spreadKeys: string[] = []

        if (args[1]) spreadKeys = spread(args[1], property)

        super(...args)

        if (!this[SPREAD_MAPPINGS]) this[SPREAD_MAPPINGS] = {}
        this[SPREAD_MAPPINGS][property] = spreadKeys
      }

      protected async fetch() {
        const res = await super.fetch()
        if (Array.isArray(res[property])) {
          throw new Error(
            // tslint:disable-next-line max-line-length
            '[@profiscience/knockout-contrib-model-mixins-spread] Can not spread an array onto a model (i.e. Object.assign({}, []))'
          )
        }

        this[SPREAD_MAPPINGS][property] = spread(res, property)

        return res
      }

      public toJS() {
        const ret = super.toJS()
        const mappings = this[SPREAD_MAPPINGS][property]
        const obj: any = {}
        mappings.forEach((m) => {
          obj[m] = ret[m]
          delete ret[m]
        })
        ret[property] = obj
        return ret
      }
    }
  }
}
