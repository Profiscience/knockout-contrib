/* tslint:disable max-classes-per-file no-empty-interface */

import * as ko from 'knockout'
import { INITIALIZED } from '@profiscience/knockout-contrib-router-plugins-init'
import '@profiscience/knockout-contrib-jest-matchers'

import { DataModelConstructorBuilder, nonenumerable } from './index'

describe('model.builders.data', () => {

  test('requires .fetch() implementation', async () => {
    class FooModel extends DataModelConstructorBuilder<{}> {}

    const foo: any = new FooModel({})

    await expect(foo[INITIALIZED]).rejects.toBeTruthy()

    foo.dispose()
  })

  test('uses .fetch() to initialize data and maps to observables', async () => {
    interface IFooParams { }

    class FooModel extends DataModelConstructorBuilder<IFooParams> {
      public readonly value: KnockoutObservable<string>

      protected async fetch() {
        return { value: 'value' }
      }
    }

    const foo = await FooModel.create({})

    expect(foo.value).toBeObservable()
    expect(foo.value()).toBe('value')

    foo.dispose()
  })

  test('throws and logs error on .fetch() rejection', async () => {
    interface IFooParams { }

    class FooModel extends DataModelConstructorBuilder<IFooParams> {
      public readonly value: KnockoutObservable<string>

      protected async fetch() {
        throw new Error()
      }
    }

    await expect(FooModel.create({})).rejects.toBeTruthy()
  })

  test('uses SubscriptionDisposalMixin', () => {
    interface IFooParams { }

    class FooModel extends DataModelConstructorBuilder<IFooParams> {
      public readonly value: KnockoutObservable<string>

      protected async fetch() {
        return { value: 'value' }
      }
    }

    const foo = new FooModel({})

    expect(foo.subscribe).toBeDefined()
    expect(foo.dispose).toBeDefined()

    foo.dispose()
  })

  test('updates model when params are changed', async () => {
    interface IFooParams {
      valueIn: KnockoutObservable<string>
    }

    class FooModel extends DataModelConstructorBuilder<IFooParams> {
      public readonly value: KnockoutObservable<string>

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
      public value: KnockoutObservable<string>

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
      public value: KnockoutObservable<string>

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
      public value: KnockoutObservable<string>

      protected async fetch() {
        return { value: 'foo' }
      }
    }

    const foo = await FooModel.create({})
    const dispose = jest.spyOn(foo, 'dispose')
    const updateAll = jest.spyOn(DataModelConstructorBuilder, 'updateAll')

    await foo.delete()

    expect(foo.dispose).toBeCalled()
    expect(updateAll).toBeCalled()
  })

  test('#updateAll() updates all registered instances', async () => {
    let value: string = 'foo'

    class M1 extends DataModelConstructorBuilder<{}> {
      public value: KnockoutObservable<string>
      protected async fetch() {
        return { value }
      }
    }
    class M2 extends DataModelConstructorBuilder<{}> {
      public value: KnockoutObservable<string>
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
