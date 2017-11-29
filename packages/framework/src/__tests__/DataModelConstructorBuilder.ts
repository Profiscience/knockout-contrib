/* tslint:disable max-classes-per-file no-empty-interface */

import 'jest'
import * as ko from 'knockout'
import '@profiscience/knockout-contrib-jest-matchers'

import { DataModelConstructorBuilder } from '../DataModelConstructorBuilder'
import { INITIALIZED } from '../symbols'

describe('DataModelConstructorBuilder', () => {

  test('requires .fetch() implementation', async () => {
    interface IFooParams { }

    class FooModel extends DataModelConstructorBuilder<IFooParams> {}

    const foo = new FooModel({})

    await expect((foo as any)[INITIALIZED]).rejects.toBeTruthy()
  })

  test('uses .fetch() to initialize data and maps to observables', async () => {
    interface IFooParams { }

    class FooModel extends DataModelConstructorBuilder<IFooParams> {
      public value: KnockoutObservable<string>

      protected async fetch() {
        return { value: 'value' }
      }
    }

    const foo = await FooModel.create({})

    expect(foo.value).toBeObservable()
    expect(foo.value()).toBe('value')
  })

  test('uses Subscribable mixin', () => {
    interface IFooParams { }

    class FooModel extends DataModelConstructorBuilder<IFooParams> {
      public value: KnockoutObservable<string>

      protected async fetch() {
        return { value: 'value' }
      }
    }

    const foo = new FooModel({})

    expect(foo.subscribe).toBeDefined()
    expect(foo.dispose).toBeDefined()
  })

  test('updates model when params are changed')
})
