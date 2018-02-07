import * as ko from 'knockout'
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'

export const SPREAD_MAPPINGS = Symbol('SPREAD_MAPPINGS')

function spread(target: any, property: string, res: any) {
  const mappings = target[SPREAD_MAPPINGS]
  mappings[property] = Object.keys(res[property])
  mappings[property].forEach((m: any) => res[m] = res[property][m])
  delete res[property]
}

export function SpreadMixin(property: string) {
  return <
    P, T extends { new(...args: any[]): DataModelConstructorBuilder<P> }
    >(ctor: T) => {
    return class extends ctor {
      protected [SPREAD_MAPPINGS]: { [k: string]: string[] } = {}

      constructor(...args: any[]) {
        super(...args)
        if (args[1]) {
          spread(this, property, this)
        }
      }

      protected async fetch() {
        const res = await super.fetch()
        if (Array.isArray(res[property])) {
          throw new Error(
            // tslint:disable-next-line max-line-length
            '[@profiscience/knockout-contrib-model-mixins-spread] Can not spread an array onto a model (i.e. Object.assign({}, []))'
          )
        }
        spread(this, property, res)
        return res
      }

      public toJS() {
        const ret = super.toJS()
        const mappings = this[SPREAD_MAPPINGS][property]
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
