/* tslint:disable max-classes-per-file no-empty-interface */

import * as ko from 'knockout'
import '@profiscience/knockout-contrib-jest-matchers'

import { ViewModelConstructorBuilder } from './index'

describe('model.builders.view', () => {
  test('uses SubscriptionDisposalMixin', () => {
    class FooModel extends ViewModelConstructorBuilder {
      public readonly value: KnockoutObservable<string>
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

  test('.dispose() calls super.dispose()', () => {
    const mock = jest.fn()
    class FooModel extends ViewModelConstructorBuilder {
      public foo = ko.observable('foo')
      constructor() {
        super()
        this.subscribe(this.foo, mock)
      }
    }

    const m = new FooModel()
    m.dispose()
    m.foo('bar')

    expect(mock).not.toBeCalled()
  })

  test('doesn\'t blow up with undefined properties', () => {
    class FooModel extends ViewModelConstructorBuilder {
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
