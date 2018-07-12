// tslint:disable:max-classes-per-file

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
})
