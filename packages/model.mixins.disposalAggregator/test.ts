// tslint:disable max-classes-per-file

import { ConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-base'

import { DisposalAggregatorMixin } from './index'

describe('model.mixins.disposalAggregator', () => {
  test('.dispose() calls .dispose() on every property that has it', () => {
    class FooModel extends ConstructorBuilder.Mixin(DisposalAggregatorMixin) {
      public foo = { dispose: jest.fn() }
      public bar = { dispose: jest.fn() }
      public baz = {}
      constructor() {
        super()
        nonenumerable(this, 'bar')
      }
    }

    const m = new FooModel()
    m.dispose()

    expect(m.foo.dispose).toBeCalled()
    expect(m.bar.dispose).toBeCalled()
  })

  test('.dispose() calls super.dispose()', () => {
    const mock = jest.fn()
    ConstructorBuilder.prototype.dispose = mock
    class FooModel extends ConstructorBuilder.Mixin(DisposalAggregatorMixin) {}
    const m = new FooModel()
    m.dispose()
    expect(mock).toBeCalled()
  })

  test("doesn't blow up with undefined properties", () => {
    class FooModel extends ConstructorBuilder.Mixin(DisposalAggregatorMixin) {
      public foo = undefined

      constructor() {
        super()
      }
    }
    const m = new FooModel()
    expect(() => m.dispose()).not.toThrow()
  })
})

function nonenumerable(target: any, prop: string) {
  Object.defineProperty(target, prop, {
    ...Object.getOwnPropertyDescriptor(target, prop),
    enumerable: false
  })
}
