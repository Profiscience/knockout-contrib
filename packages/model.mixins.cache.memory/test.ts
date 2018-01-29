// tslint:disable max-classes-per-file

import * as ko from 'knockout'
import '@profiscience/knockout-contrib-jest-matchers'
import { ConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-base'
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'

import { InMemoryCacheMixin } from './index'

describe('model.mixins.cache.memory', () => {
  test('throws with invalid implementation', async () => {
    class DataModel<P> extends DataModelConstructorBuilder.Mixin(InMemoryCacheMixin())<P> {
      public foo: KnockoutObservable<string>
      protected async fetch() { return { foo: 'foo' } }
    }

    await expect(DataModel.create({})).rejects.toBeTruthy()
  })

  test('uses super.fetch to fetch response', async () => {
    // tslint:disable-next-line variable-name
    const FetchMixin = <
      P, T extends { new(...args: any[]): DataModelConstructorBuilder<P> }
    >(ctor: T) => class extends ctor {
      protected async fetch() {
        return { foo: 'foo' }
      }
    }

    class DataModel<P> extends DataModelConstructorBuilder
      .Mixin(FetchMixin)
      .Mixin(InMemoryCacheMixin())<P> {
      public foo: KnockoutObservable<string>
    }

    const m1 = await DataModel.create({})

    expect(m1.foo()).toBe('foo')

    m1.dispose()
  })

  test('uses pending request if second request made with same params', async () => {
    let resolve: any

    const fetch = jest.fn(() => new Promise((_resolve) => resolve = () => _resolve({ foo: 'foo' })))

    // tslint:disable-next-line variable-name
    const FetchMixin = <
      P, T extends { new(...args: any[]): DataModelConstructorBuilder<P> }
    >(ctor: T) => class extends ctor {
      protected async fetch() {
        return fetch()
      }
    }

    class DataModel<P> extends DataModelConstructorBuilder
      .Mixin(FetchMixin)
      .Mixin(InMemoryCacheMixin())<P> {
      public foo: KnockoutObservable<string>
    }

    const m1 = new DataModel({})
    {(m1 as any).fetch()}
    {(m1 as any).fetch()}

    resolve()

    expect(fetch).toHaveBeenCalledTimes(1)

    m1.dispose()
  })

  test('cache is shared across instances', async () => {
    let resolve: any

    const fetch = jest.fn(() => new Promise((_resolve) => resolve = () => _resolve({ foo: 'foo' })))

    // tslint:disable-next-line variable-name
    const FetchMixin = <
      P, T extends { new(...args: any[]): DataModelConstructorBuilder<P> }
    >(ctor: T) => class extends ctor {
      protected async fetch() {
        return fetch()
      }
    }

    class DataModel<P> extends DataModelConstructorBuilder
      .Mixin(FetchMixin)
      .Mixin(InMemoryCacheMixin())<P> {
      public foo: KnockoutObservable<string>
    }

    const m1 = new DataModel({})
    const m2 = new DataModel({})
    {(m1 as any).fetch()}
    {(m2 as any).fetch()}

    resolve()

    expect(fetch).toHaveBeenCalledTimes(1)

    m1.dispose()
    m2.dispose()
  })

  test('cache uses params to index', async () => {
    const fetch = jest.fn()

    interface IDataModelParams {
      param: KnockoutObservable<number>
    }

    // tslint:disable-next-line variable-name
    const FetchMixin = <
      P, T extends { new(...args: any[]): DataModelConstructorBuilder<P> }
      >(ctor: T) => class extends ctor {
      public v: IDataModelParams
      protected async fetch() {
        fetch()
        return { v: ko.toJS(this.params) }
      }
    }

    const param = ko.observable(false)

    class DataModel extends DataModelConstructorBuilder
      .Mixin(FetchMixin)
      .Mixin(InMemoryCacheMixin())
      <IDataModelParams> {
      public foo: KnockoutObservable<string>
    }

    const model = await DataModel.create({ param })

    expect(model.v.param()).toBe(false)

    param(true)
    await new Promise((resolve) => {
      const sub = model.v.param.subscribe((v) => {
        expect(v).toBe(true)
        sub.dispose()
        resolve()
      })
    })

    param(false)
    await new Promise((resolve) => {
      const sub = model.v.param.subscribe((v) => {
        expect(v).toBe(false)
        sub.dispose()
        resolve()
      })
    })

    param(true)
    await new Promise((resolve) => {
      const sub = model.v.param.subscribe((v) => {
        expect(v).toBe(true)
        sub.dispose()
        resolve()
      })
    })

    expect(fetch).toHaveBeenCalledTimes(2)

    model.dispose()
  })

  test('deletes all caches on save', async () => {
    const fetch = jest.fn()

    // tslint:disable-next-line variable-name
    const FetchMixin = <
      P, T extends { new(...args: any[]): DataModelConstructorBuilder<P> }
      >(ctor: T) => class extends ctor {
      protected async fetch() {
        fetch()
        return { foo: 'foo' }
      }
    }

    class DataModel1 extends DataModelConstructorBuilder
      .Mixin(FetchMixin)
      .Mixin(InMemoryCacheMixin())
      <{}> {
      public foo: KnockoutObservable<string>
    }

    class DataModel2 extends DataModelConstructorBuilder
      .Mixin(FetchMixin)
      .Mixin(InMemoryCacheMixin())
      <{}> {
      public foo: KnockoutObservable<string>
    }

    const m11 = await DataModel1.create({})
    const m12 = await DataModel1.create({})
    const m21 = await DataModel2.create({})
    const m22 = await DataModel2.create({})

    await m11.save()

    expect(fetch).toHaveBeenCalledTimes(4)

    m11.dispose()
    m12.dispose()
    m21.dispose()
    m22.dispose()
  })

  test('deletes all caches on delete', async () => {
    const fetch = jest.fn()

    // tslint:disable-next-line variable-name
    const FetchMixin = <
      P, T extends { new(...args: any[]): DataModelConstructorBuilder<P> }
      >(ctor: T) => class extends ctor {
      protected async fetch() {
        fetch()
        return { foo: 'foo' }
      }
    }

    class DataModel1 extends DataModelConstructorBuilder
      .Mixin(FetchMixin)
      .Mixin(InMemoryCacheMixin())
      <{}> {
      public foo: KnockoutObservable<string>
    }

    class DataModel2 extends DataModelConstructorBuilder
      .Mixin(FetchMixin)
      .Mixin(InMemoryCacheMixin())
      <{}> {
      public foo: KnockoutObservable<string>
    }

    const m11 = await DataModel1.create({})
    const m12 = await DataModel1.create({})
    const m21 = await DataModel2.create({})
    const m22 = await DataModel2.create({})

    await m11.delete() // m12, m2*
    await m12.delete() // m2*

    expect(fetch).toHaveBeenCalledTimes(5)
  })
})
