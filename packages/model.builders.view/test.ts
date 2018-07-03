/* tslint:disable max-classes-per-file no-empty-interface */

import '@profiscience/knockout-contrib-jest-matchers'

import { ViewModelConstructorBuilder } from './index'

describe('model.builders.view', () => {
  test('uses SubscriptionDisposalMixin', () => {
    class FooModel extends ViewModelConstructorBuilder {
      public readonly value!: ko.Observable<string>
    }

    const foo = new FooModel()

    expect(foo.subscribe).toBeDefined()
    expect(foo.dispose).toBeDefined()
  })

  test('.dispose() calls .dispose() on every property that has it', () => {
    class FooModel extends ViewModelConstructorBuilder {
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
})

function nonenumerable(target: any, prop: string) {
  Object.defineProperty(target, prop, {
    ...Object.getOwnPropertyDescriptor(target, prop),
    enumerable: false
  })
}
