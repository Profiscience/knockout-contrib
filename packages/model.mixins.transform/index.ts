import * as ko from 'knockout'
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'

export function TransformMixin<P extends {}>(transform: (fetchData: any, params: P) => any) {
  return <T extends { new(...args: any[]): DataModelConstructorBuilder<P> }>(ctor: T) => class extends ctor {

    constructor(...args: any[]) {
      if (args[1]) args[1] = transform(args[1], args[0])
      super(...args)
    }

    protected async fetch() {
      return transform(await super.fetch(), this.params)
    }
  }
}
