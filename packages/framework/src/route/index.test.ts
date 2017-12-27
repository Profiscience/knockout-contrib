import * as ko from 'knockout'
import { Context, Middleware } from '@profiscience/knockout-contrib-router'
import { Route, STATE } from './'

describe('Route', () => {
  test('produces normalized route config', () => {
    const route = new Route('/foo', {
      children: [
        new Route('/bar', {}),
        new Route('/baz', {})
      ]
    })

    expect(route).toEqual({
      '/foo': [
        {
          '/bar': [],
          '/baz': []
        }
      ]
    })
  })

  describe('state', () => {
    test('state is not enumerated', () => {
      const route = new Route('/foo', { state: 'foo' })

      expect(Object.keys(route)).toEqual(['/foo'])
    })

    test('state is accessible via exported STATE symbol', () => {
      const route = new Route('/foo', { state: 'foo' })

      expect((route['/foo'] as any)[STATE]).toEqual('foo')
    })
  })

  describe('with', () => {
    test('extends context with object passed to with', () => {
      const route = new Route('/foo', { with: { foo: 'bar' } })
      const [middleware] = route['/foo']
      const ctx = {} as Context

      (middleware as Middleware)(ctx)

      expect((ctx as any).foo).toBe('bar')
    })

    test('works with symbol keys', () => {
      const FOO = Symbol('foo')
      const route = new Route('/foo', { with: { [FOO]: 'bar' } })
      const [middleware] = route['/foo']
      const ctx = {} as Context

      (middleware as Middleware)(ctx)

      expect((ctx as any)[FOO]).toBe('bar')
    })
  })
})
