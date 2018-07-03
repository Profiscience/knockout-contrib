/* tslint:disable max-classes-per-file no-empty-interface */

import * as ko from 'knockout'
import { INITIALIZED } from '@profiscience/knockout-contrib-router-plugins-init'
import '@profiscience/knockout-contrib-jest-matchers'

import { DataModelConstructorBuilder, nonenumerable } from './index'

describe('model.builders.data', () => {
  test('requires .fetch() implementation if no initial data', async () => {
    class FooModel extends DataModelConstructorBuilder<{}> {}

    const foo: any = new FooModel({})

    await expect(foo[INITIALIZED]).rejects.toBeTruthy()

    foo.dispose()
  })

  test('uses initial data with constructor if provided', async () => {
    class FooModel extends DataModelConstructorBuilder<{}> {
      public readonly value!: ko.Observable<string>
    }
    const foo = new FooModel({}, { value: 'value' })

    await foo[INITIALIZED]

    expect(foo.value).toBe('value')

    foo.dispose()
  })

  test('uses .fetch() to initialize data and merges w/ strict', async () => {
    interface IFooParams {}

    class FooModel extends DataModelConstructorBuilder<IFooParams> {
      public readonly foo = ko.observable()
      public readonly bar!: string

      protected async fetch() {
        return { foo: 'foo', bar: 'bar' }
      }
    }

    const model = await FooModel.create({})

    expect(model.foo).toBeObservable()
    expect(model.foo()).toBe('foo')

    expect(model.bar).not.toBeObservable()
    expect(model.bar).toBe('bar')

    model.dispose()
  })

  test('throws and logs error on .fetch() rejection', async () => {
    interface IFooParams {}

    class FooModel extends DataModelConstructorBuilder<IFooParams> {
      public readonly value!: ko.Observable<string>

      protected async fetch() {
        throw new Error()
      }
    }

    await expect(FooModel.create({})).rejects.toBeTruthy()
  })

  test('uses SubscriptionDisposalMixin', () => {
    interface IFooParams {}

    class FooModel extends DataModelConstructorBuilder<IFooParams> {
      public readonly value!: ko.Observable<string>

      protected async fetch() {
        return { value: 'value' }
      }
    }

    const foo = new FooModel({})

    expect(foo.subscribe).toBeDefined()
    expect(foo.dispose).toBeDefined()

    foo.dispose()
  })

  test('.dispose() calls .dispose() on every property that has it', () => {
    class FooModel extends DataModelConstructorBuilder<{}> {
      public foo = { dispose: jest.fn() }
      public bar = { dispose: jest.fn() }
      public baz = {}
      constructor() {
        super({})
        nonenumerable(this, 'bar')
      }
      protected async fetch() {
        return {}
      }
    }

    const m = new FooModel()
    m.dispose()

    expect(m.foo.dispose).toBeCalled()
    expect(m.bar.dispose).toBeCalled()
  })

  test('.dispose() calls super.dispose()', () => {
    const mock = jest.fn()
    class FooModel extends DataModelConstructorBuilder<{}> {
      public foo = ko.observable('foo')
      constructor() {
        super({})
        this.subscribe(this.foo, mock)
      }
      protected async fetch() {
        return {}
      }
    }

    const m = new FooModel()
    m.dispose()
    m.foo('bar')

    expect(mock).not.toBeCalled()
  })

  test('updates model when params are changed', async () => {
    interface IFooParams {
      valueIn: ko.Observable<string>
    }

    class FooModel extends DataModelConstructorBuilder<IFooParams> {
      public readonly value = ko.observable()

      protected async fetch() {
        return { value: this.params.valueIn() }
      }
    }

    const params: IFooParams = { valueIn: ko.observable('foo') }
    const foo = await FooModel.create(params)

    expect(foo.value()).toBe('foo')
    params.valueIn('bar')

    expect(foo.loading()).toBe(true)
    await new Promise((resolve) => {
      const sub = foo.value.subscribe((newVal) => {
        sub.dispose()
        resolve()
      })
    })

    expect(foo.loading()).toBe(false)
    expect(foo.value()).toBe('bar')

    foo.dispose()
  })

  test('.toJS() returns unwrapped data', async () => {
    class FooModel extends DataModelConstructorBuilder<{}> {
      public value!: ko.Observable<string>

      protected async fetch() {
        return { value: 'foo' }
      }
    }

    const foo = await FooModel.create({})

    expect(foo.toJS()).toEqual({
      value: 'foo'
    })

    foo.dispose()
  })

  test('.save() calls #updateAll()', async () => {
    class FooModel extends DataModelConstructorBuilder<{}> {
      public value!: ko.Observable<string>

      protected async fetch() {
        return { value: 'foo' }
      }
    }

    const foo = await FooModel.create({})
    const updateAll = jest.spyOn(DataModelConstructorBuilder, 'updateAll')

    await foo.save()

    expect(updateAll).toBeCalled()

    foo.dispose()
  })

  test('.delete() disposes the instance, then updates', async () => {
    class FooModel extends DataModelConstructorBuilder<{}> {
      public value!: ko.Observable<string>

      protected async fetch() {
        return { value: 'foo' }
      }
    }

    const foo = await FooModel.create({})
    const dispose = jest.spyOn(foo, 'dispose')
    const updateAll = jest.spyOn(DataModelConstructorBuilder, 'updateAll')

    await foo.delete()

    expect(dispose).toBeCalled()
    expect(updateAll).toBeCalled()
  })

  test('#updateAll() updates all registered instances', async () => {
    let value: string = 'foo'

    class M1 extends DataModelConstructorBuilder<{}> {
      public value = ko.observable()
      protected async fetch() {
        return { value }
      }
    }
    class M2 extends DataModelConstructorBuilder<{}> {
      public value = ko.observable()
      protected async fetch() {
        return { value }
      }
    }

    const m1 = await M1.create({})
    const m2 = await M2.create({})

    expect(m1.value()).toBe('foo')
    expect(m2.value()).toBe('foo')

    value = 'bar'
    await DataModelConstructorBuilder.updateAll()

    // expect(m1.value()).toBe('bar')
    // expect(m2.value()).toBe('bar')

    // m1.dispose()
    // value = 'baz'
    // await DataModelConstructorBuilder.updateAll()

    // expect(m1.value()).toBe('bar')
    // expect(m2.value()).toBe('baz')
  })

  describe('utils', () => {
    test('nonenumerable', () => {
      const obj = {
        foo: 'foo',
        bar: 'bar',
        dontIncludeThis: 'no good',
        baz: 'baz'
      }
      nonenumerable(obj, 'dontIncludeThis')

      expect(Object.keys(obj)).toEqual(['foo', 'bar', 'baz'])
    })
  })
})
