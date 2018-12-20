import { ConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-base'

const NO_AUTO_DISPOSE = Symbol()

export function noAutoDispose<T>(property: T): T {
  ;(property as any)[NO_AUTO_DISPOSE] = true
  return property
}

export function DisposalAggregatorMixin<
  T extends new (...args: any[]) => ConstructorBuilder
>(ctor: T) {
  return class extends ctor {
    public dispose() {
      const m = this as any
      Object.getOwnPropertyNames(m).forEach((k) => {
        if (
          m[k] &&
          !m[k][NO_AUTO_DISPOSE] &&
          typeof m[k].dispose === 'function'
        ) {
          m[k].dispose()
        }
      })
      super.dispose()
    }
  }
}
