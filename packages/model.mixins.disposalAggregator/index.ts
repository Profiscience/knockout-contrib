import { ConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-base'

export function DisposalAggregatorMixin<
  T extends { new (...args: any[]): ConstructorBuilder }
>(ctor: T) {
  return class extends ctor {
    public dispose() {
      const m = this as any
      Object.getOwnPropertyNames(m).forEach((k) => {
        if (m[k] && typeof m[k].dispose === 'function') m[k].dispose()
      })
      super.dispose()
    }
  }
}
