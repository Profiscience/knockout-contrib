import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'

export function TransformMixin<
  TParams extends void | Record<string, any>,
  TData extends Record<string, any>
>(transform: (fetchData: TData, params: TParams) => any) {
  return <
    T extends new (...args: any[]) => DataModelConstructorBuilder<
      TParams,
      TData
    >
  >(
    ctor: T
  ) =>
    class extends ctor {
      protected async fetch(initData?: TData) {
        return transform(await super.fetch(initData), this.params)
      }
    }
}
