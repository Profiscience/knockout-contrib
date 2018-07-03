import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'

export function TransformMixin<P extends {}>(
  transform: (fetchData: any, params: P) => any
) {
  return <T extends { new (...args: any[]): DataModelConstructorBuilder<P> }>(
    ctor: T
  ) =>
    class extends ctor {
      protected async fetch(...args: any[]) {
        return transform(await super.fetch(...args), this.params)
      }
    }
}
