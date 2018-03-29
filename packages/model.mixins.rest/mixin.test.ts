// tslint:disable max-classes-per-file variable-name

import * as ko from 'knockout'
import { ConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-base'
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'
import * as fetch from 'jest-fetch-mock'

import { createRESTMixin } from './mixin'

// tslint:disable-next-line no-var-requires
(global as any).fetch = require('jest-fetch-mock')

beforeEach(() => {
  fetch.resetMocks()
})

const FOOS = ['foo', 'bar', 'baz', 'qux']

describe('model.mixins.rest', () => {
  describe('baseURL', () => {
    test('defaults to empty string', async () => {
      const APIMixin = createRESTMixin()
      class DataModel<P> extends DataModelConstructorBuilder.Mixin(APIMixin('/api'))<P> {
        public foos = ko.observableArray()
      }

      const { mock } = fetch.mockResponse(JSON.stringify({ foos: FOOS })) as any
      const model = await DataModel.create({})

      expect(ko.toJS(model.foos())).toEqual(FOOS)
      expect(mock.calls[0][0]).toBe('/api')
    })

    test('is compose-able', async () => {
      const APIMixin = createRESTMixin({ baseURL: '/api' })
      class DataModel<P> extends DataModelConstructorBuilder.Mixin(APIMixin('controller'))<P> {
      }

      const { mock } = fetch.mockResponse(JSON.stringify({ foos: FOOS })) as any
      const model = await DataModel.create({})
      const res = await (model as any).api.get('endpoint')

      expect(res.foos).toEqual(FOOS)

      expect(mock.calls[1][0]).toBe('/api/controller/endpoint')
    })
  })

  test('implements fetch using GET', async () => {
    const APIMixin = createRESTMixin({ baseURL: '/api' })
    class DataModel<P> extends DataModelConstructorBuilder.Mixin(APIMixin('controller'))<P> {
      public foos = ko.observableArray()
    }

    const { mock } = fetch.mockResponse(JSON.stringify({ foos: FOOS })) as any
    const model = await DataModel.create({})

    expect(ko.toJS(model.foos())).toEqual(FOOS)
    expect(mock.calls[0][0]).toBe('/api/controller')
    expect(mock.calls[0][1].method).toBe('GET')
  })

  test('implements .create() using POST', async () => {
    const APIMixin = createRESTMixin({ baseURL: '/api' })
    class DataModel<P> extends DataModelConstructorBuilder.Mixin(APIMixin('controller'))<P> {
      public foos: KnockoutObservableArray<string>
    }

    const { mock } = fetch.mockResponse(JSON.stringify({ foos: FOOS })) as any
    const model = await DataModel.create({})

    model.toJS = jest.fn()
    DataModelConstructorBuilder.updateAll = jest.fn()

    await model.create()

    expect(mock.calls[1][0]).toBe('/api/controller')
    expect(mock.calls[1][1].method).toBe('POST')
    expect(model.toJS).toBeCalled()
    expect(DataModelConstructorBuilder.updateAll).toBeCalled()
  })

  test('implements .save() using PUT', async () => {
    const APIMixin = createRESTMixin({ baseURL: '/api' })
    class DataModel<P> extends DataModelConstructorBuilder.Mixin(APIMixin('controller'))<P> {
      public foos: KnockoutObservableArray<string>
    }

    const { mock } = fetch.mockResponse(JSON.stringify({ foos: FOOS })) as any
    const model = await DataModel.create({})

    model.toJS = jest.fn()
    DataModelConstructorBuilder.updateAll = jest.fn()

    await model.save()

    expect(mock.calls[1][0]).toBe('/api/controller')
    expect(mock.calls[1][1].method).toBe('PUT')
    expect(model.toJS).toBeCalled()
    expect(DataModelConstructorBuilder.updateAll).toBeCalled()
  })

  test('implements .delete() using DELETE', async () => {
    const APIMixin = createRESTMixin({ baseURL: '/api' })
    class DataModel<P> extends DataModelConstructorBuilder.Mixin(APIMixin('controller'))<P> {
      public foos: KnockoutObservableArray<string>
    }

    const { mock } = fetch.mockResponse(JSON.stringify({ foos: FOOS })) as any
    const model = await DataModel.create({})

    model.dispose = jest.fn()
    DataModelConstructorBuilder.updateAll = jest.fn()

    await model.delete()

    expect(mock.calls[1][0]).toBe('/api/controller')
    expect(mock.calls[1][1].method).toBe('DELETE')
    expect(model.dispose).toBeCalled()
    expect(DataModelConstructorBuilder.updateAll).toBeCalled()
  })

  test('does not pollute enumerable properties', async () => {
    const APIMixin = createRESTMixin({ baseURL: '/api' })
    class DataModel<P> extends DataModelConstructorBuilder.Mixin(APIMixin('controller'))<P> {
      public foos: KnockoutObservableArray<string>
    }

    const { mock } = fetch.mockResponse(JSON.stringify({ foos: FOOS })) as any
    const model = await DataModel.create({})

    expect(Object.keys(model)).toEqual(['foos'])
  })

})
