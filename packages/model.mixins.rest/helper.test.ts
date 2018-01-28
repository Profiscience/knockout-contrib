import { RestApiHelper, RestApiError } from './helper'
import 'jest-fetch-mock'

// tslint:disable-next-line no-var-requires
(global as any).fetch = require('jest-fetch-mock')

beforeEach(() => {
  fetch.resetMocks()
})

describe('model.mixins.rest api helper', () => {
  describe('url', () => {
    test('default baseURL is empty string', () => {
      const api = new RestApiHelper({})
      const { mock } = fetch.mockResponseOnce(JSON.stringify({ foo: 'bar' })) as any
      api.get()
      expect(mock.calls[0][0]).toBe('')
    })

    test('defaults to baseURL if no args', () => {
      const api = new RestApiHelper({ baseURL: '/foo' })
      const { mock } = fetch.mockResponseOnce(JSON.stringify({ foo: 'bar' })) as any
      api.get()
      expect(mock.calls[0][0]).toBe('/foo')
    })

    test('defaults to baseURL if only options', () => {
      const api = new RestApiHelper({ baseURL: '/foo' })
      const { mock } = fetch.mockResponseOnce(JSON.stringify({ foo: 'bar' })) as any
      api.get({})
      expect(mock.calls[0][0]).toBe('/foo')
    })

    test('uses baseURL + endpoint if supplied', () => {
      const api = new RestApiHelper({ baseURL: '/foo' })
      const { mock } = fetch.mockResponseOnce(JSON.stringify({ foo: 'bar' })) as any
      api.get('/bar')
      expect(mock.calls[0][0]).toBe('/foo/bar')
    })
  })

  describe('query', () => {
    test('defaults to simple bracket notation querystring', () => {
      const api = new RestApiHelper({})
      const { mock } = fetch.mockResponseOnce(JSON.stringify({ foo: 'bar' })) as any
      api.get({
        params: {
          foo: 'foo',
          bar: [
            'bar1',
            'bar2'
          ]
        }
      })
      expect(mock.calls[0][0]).toBe('?foo=foo&bar[]=bar1&bar[]=bar2')
    })

    test('query stringifier is configurable', () => {
      const api = new RestApiHelper({
        stringifyQuery: (q) => JSON.stringify(q)
      })
      const { mock } = fetch.mockResponseOnce(JSON.stringify({ foo: 'bar' })) as any
      const params = {
        foo: 'foo',
        bar: [
          'bar1',
          'bar2'
        ]
      }
      api.get({ params })
      expect(mock.calls[0][0]).toBe('?' + JSON.stringify(params))
    })
  })

  describe('headers', () => {
    test('adds content-type application/json header', () => {
      const api = new RestApiHelper({})
      const { mock } = fetch.mockResponseOnce(JSON.stringify({ foo: 'bar' })) as any
      api.get()
      expect(mock.calls[0][1].headers['Content-Type']).toBe('application/json')
    })

    test('headers are configurable', () => {
      const api = new RestApiHelper({
        headers: {
          'X-Test': 'foobar'
        }
      })
      const { mock } = fetch.mockResponseOnce(JSON.stringify({ foo: 'bar' })) as any
      api.get()
      expect(mock.calls[0][1].headers['Content-Type']).toBe('application/json')
      expect(mock.calls[0][1].headers['X-Test']).toBe('foobar')
    })
  })

  describe('authentication', () => {
    test('mode is unset when cors option is false', () => {
      const api = new RestApiHelper({})
      const { mock } = fetch.mockResponseOnce(JSON.stringify({ foo: 'bar' })) as any
      api.get()
      expect(mock.calls[0][1].mode).toBeUndefined()
    })

    test('mode is cors when cors option is true', () => {
      const api = new RestApiHelper({
        cors: true
      })
      const { mock } = fetch.mockResponseOnce(JSON.stringify({ foo: 'bar' })) as any
      api.get()
      expect(mock.calls[0][1].mode).toBe('cors')
    })

    test('credentials is include when cors and authenticated options', () => {
      const api = new RestApiHelper({
        cors: true,
        authenticated: true
      })
      const { mock } = fetch.mockResponseOnce(JSON.stringify({ foo: 'bar' })) as any
      api.get()
      expect(mock.calls[0][1].credentials).toBe('include')
    })

    test('credentials is same-origin when authenticated and not cors', () => {
      const api = new RestApiHelper({
        authenticated: true
      })
      const { mock } = fetch.mockResponseOnce(JSON.stringify({ foo: 'bar' })) as any
      api.get()
      expect(mock.calls[0][1].credentials).toBe('same-origin')
    })

    test('credentials is unset when not authenticated (even if cors)', () => {
      const corsApi = new RestApiHelper({ cors: true })
      const nonCorsApi = new RestApiHelper({})
      const { mock } = fetch.mockResponse(JSON.stringify({ foo: 'bar' })) as any
      corsApi.get()
      nonCorsApi.get()
      expect(mock.calls[0][1].credentials).toBeUndefined()
      expect(mock.calls[1][1].credentials).toBeUndefined()
    })
  })

  describe('constants', () => {
    test('sets cache no-cache', () => {
      const api = new RestApiHelper({})
      const { mock } = fetch.mockResponseOnce(JSON.stringify({ foo: 'bar' })) as any
      api.get()
      expect(mock.calls[0][1].cache).toBe('no-cache')
    })

    test('sets redirect follow', () => {
      const api = new RestApiHelper({})
      const { mock } = fetch.mockResponseOnce(JSON.stringify({ foo: 'bar' })) as any
      api.get()
      expect(mock.calls[0][1].redirect).toBe('follow')
    })
  })

  describe('helper methods', () => {
    test('return parsed response', async () => {
      const api = new RestApiHelper({})
      const { mock } = fetch.mockResponseOnce(JSON.stringify({ foo: 'bar' })) as any
      const res = await api.get()
      expect(res).toEqual({ foo: 'bar' })
    })

    test('uses the correct HTTP method', () => {
      const api = new RestApiHelper({})
      const { mock } = fetch.mockResponse(JSON.stringify({ foo: 'bar' })) as any

      api.get()
      api.post()
      api.put()
      api.patch()
      api.delete()

      expect(mock.calls[0][1].method).toBe('GET')
      expect(mock.calls[1][1].method).toBe('POST')
      expect(mock.calls[2][1].method).toBe('PUT')
      expect(mock.calls[3][1].method).toBe('PATCH')
      expect(mock.calls[4][1].method).toBe('DELETE')
    })

    test('post, put, patch, and delete support data as first arg', () => {
      const api = new RestApiHelper({})
      const { mock } = fetch.mockResponse(JSON.stringify({ foo: 'bar' })) as any
      const data = { baz: 'qux' }
      const jsonData = JSON.stringify(data)

      api.post({ data })
      api.put({ data })
      api.patch({ data })
      api.delete({ data })

      expect(mock.calls[0][1].body).toBe(jsonData)
      expect(mock.calls[1][1].body).toBe(jsonData)
      expect(mock.calls[2][1].body).toBe(jsonData)
      expect(mock.calls[3][1].body).toBe(jsonData)
    })

    test('post, put, patch, and delete support data as second arg', () => {
      const api = new RestApiHelper({})
      const { mock } = fetch.mockResponse(JSON.stringify({ foo: 'bar' })) as any
      const data = { baz: 'qux' }
      const jsonData = JSON.stringify(data)

      api.post('/', { data })
      api.put('/', { data })
      api.patch('/', { data })
      api.delete('/', { data })

      expect(mock.calls[0][1].body).toBe(jsonData)
      expect(mock.calls[1][1].body).toBe(jsonData)
      expect(mock.calls[2][1].body).toBe(jsonData)
      expect(mock.calls[3][1].body).toBe(jsonData)
    })

    test('post, put, patch, and delete don\'t blow up if no data', () => {
      const api = new RestApiHelper({})
      const { mock } = fetch.mockResponse(JSON.stringify({ foo: 'bar' })) as any

      api.post()
      api.put()
      api.patch()
      api.delete()

      expect(mock.calls[0][1].body).toBeUndefined()
      expect(mock.calls[1][1].body).toBeUndefined()
      expect(mock.calls[2][1].body).toBeUndefined()
      expect(mock.calls[3][1].body).toBeUndefined()
    })

    test('rejects if status < 200', async () => {
      const api = new RestApiHelper({})
      const { mock } = fetch.mockResponse('', { status: 199 }) as any
      await expect(api.get()).rejects.toBeInstanceOf(RestApiError)
    })

    test('rejects if status >= 300', async () => {
      const api = new RestApiHelper({})
      const { mock } = fetch.mockResponse('', { status: 301 }) as any
      await expect(api.get()).rejects.toBeInstanceOf(RestApiError)
    })
  })
})
