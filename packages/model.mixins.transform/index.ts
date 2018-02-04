import * as ko from 'knockout'
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'

export function TransformMixin(transform: (this: any, fetchData: any) => any) {
  return <
    P extends {}, T extends { new(...args: any[]): DataModelConstructorBuilder<P> }
  >(ctor: T) => class extends ctor {
    protected async fetch() {
      const res = await super.fetch()
      return transform.call(this, res)
    }
  }
}
