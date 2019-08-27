import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'
import { Query } from '@profiscience/knockout-contrib-query'
import '@profiscience/knockout-contrib-jest-matchers'

import { QueryMixin } from './index'

describe('model.mixins.query', () => {
  test('creates and attaches a query object to the model', async () => {
    class DataModel<P> extends DataModelConstructorBuilder.Mixin(
      QueryMixin({ myQueryParam: '' })
    )<P> {
      protected async fetch(): Promise<any> {
        return {
          foos: ['foo', 'bar', 'baz', 'qux']
        }
      }
    }

    const model = await DataModel.create({})

    expect(model.query).toBeInstanceOf(Query)
    expect(model.query.myQueryParam).toBeObservable()

    model.dispose()
  })

  test('merges query with params', async () => {
    class DataModel<P> extends DataModelConstructorBuilder.Mixin(
      QueryMixin({ searchText: '' })
    )<P> {
      protected async fetch(): Promise<any> {
        expect(this.params.searchText).toBeObservable()
        expect(this.params.searchText()).toBe('')
        return []
      }
    }

    const model = await DataModel.create({})

    model.dispose()
  })

  test('modifying query parameter triggers update', async () => {
    const fetch = jest.fn()

    class DataModel<P> extends DataModelConstructorBuilder.Mixin(
      QueryMixin({ myQueryParam: '' })
    )<P> {
      protected async fetch() {
        fetch()
        return ''
      }
    }

    const model = await DataModel.create({})

    model.query.myQueryParam('foo')

    expect(fetch).toHaveBeenCalledTimes(2)
  })

  test('query is disposed when model is disposed', async () => {
    /**
     * This happens automatically thanks to the disposalAggregator mixin included
     * in both of the model builders, but it's still good to test to make sure that
     * it's really happening.
     */
    const fetch = jest.fn()

    class DataModel<P> extends DataModelConstructorBuilder.Mixin(
      QueryMixin({ myQueryParam: '' })
    )<P> {
      constructor(params: P, initData?: any) {
        super(params, initData)
      }
      protected async fetch() {
        fetch()
        return ''
      }
    }

    const model = await DataModel.create({})

    model.query.dispose = jest.fn()
    model.dispose()

    expect(model.query.dispose).toHaveBeenCalled()
  })

  test('can optionally use query group', async () => {
    class FooModel<P> extends DataModelConstructorBuilder.Mixin(
      QueryMixin({ myQueryParam: '' }, 'foo')
    )<P> {
      protected async fetch(): Promise<any> {
        return {
          foos: ['foo', 'bar', 'baz', 'qux']
        }
      }
    }

    class Foo2Model<P> extends DataModelConstructorBuilder.Mixin(
      QueryMixin({ myQueryParam: '' }, 'foo')
    )<P> {
      protected async fetch(): Promise<any> {
        return {
          foos: ['foo', 'bar', 'baz', 'qux']
        }
      }
    }

    class BarModel<P> extends DataModelConstructorBuilder.Mixin(
      QueryMixin({ myQueryParam: '' }, 'bar')
    )<P> {
      protected async fetch(): Promise<any> {
        return {
          foos: ['foo', 'bar', 'baz', 'qux']
        }
      }
    }

    const [foo, foo2, bar] = await Promise.all([
      FooModel.create({}),
      Foo2Model.create({}),
      BarModel.create({})
    ])

    foo.query.myQueryParam('foo')

    expect(foo2.query.myQueryParam()).toBe('foo')
    expect(bar.query.myQueryParam()).toBe('')

    foo.dispose()
    foo2.dispose()
    bar.dispose()
  })

  test('subclass can use different query', async () => {
    class FooModel<P> extends DataModelConstructorBuilder.Mixin(
      QueryMixin({ foo: 'foo' }, 'foo')
    )<P> {
      protected async fetch(): Promise<any> {
        return this.params
      }
    }

    class BarModel<P> extends FooModel.Mixin(QueryMixin({ bar: 'bar' }, 'bar'))<
      P
    > {
      protected async fetch(): Promise<any> {
        return this.params
      }
    }

    const bar = await BarModel.create({})

    expect(bar.toJS()).toEqual({
      bar: 'bar'
    })
  })
})
