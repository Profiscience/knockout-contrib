import * as ko from 'knockout'
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'

const ORIGINAL_FETCH = Symbol('ORIGINAL_FETCH')

export function LazyMixin(triggerProp: string) {
  return <
    P extends { page: number }, T extends { new(...args: any[]): DataModelConstructorBuilder<P> }
  >(ctor: T) => class extends ctor {
    protected [ORIGINAL_FETCH]: any

    constructor(...args: any[]) {
      super(...args)

      let awake = false
      let v = (this as any)[triggerProp]
      Object.defineProperty(this, triggerProp, {
        get: () => {
          if (!awake) {
            awake = true
            this.fetch = this[ORIGINAL_FETCH]
            this.update()
          }
          return v
        },
        set: (_v) => v = _v
      })
    }

    protected async fetch() {
      this[ORIGINAL_FETCH] = super.fetch.bind(this)
      return {}
    }
  }
}
