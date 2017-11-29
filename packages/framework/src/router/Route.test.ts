import 'jest'

import { isPlainObject } from 'lodash'
import { Route } from './Route'
import { Context, IContext, Middleware } from '@profiscience/knockout-contrib-router'

describe('Route', () => {
  test('transforms properties into normalized route config', () => {
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

  describe('title', () => {
    test('sets the title after render and reverts after dispose', () => {
      document.title = 'start'

      const ctx = {} as Context & IContext
      const route = new Route('/foo', { title: 'foo' })
      const [middleware] = route['/foo']
      const lifecycle = (middleware as Middleware)(ctx) as Iterator<void>

      lifecycle.next()
      lifecycle.next()
      expect(document.title).toBe('foo')
      lifecycle.next()
      lifecycle.next()
      expect(document.title).toBe('start')
    })

    test('title works with synchronous getter function', () => {
      document.title = 'start'

      const ctx = {} as Context & IContext
      const route = new Route('/foo', { title: () => 'foo' })
      const [middleware] = route['/foo']
      const lifecycle = (middleware as Middleware)(ctx) as Iterator<void>

      lifecycle.next()
      lifecycle.next()
      expect(document.title).toBe('foo')
      lifecycle.next()
      lifecycle.next()
      expect(document.title).toBe('start')
    })

    test('title works with asynchronous getter function', async () => {
      document.title = 'start'
      const route = new Route('/foo', { title: async () => 'foo' })
      const [middleware] = route['/foo']
      let ctx: Context & IContext
      let lifecycle: any

      const queue = new Promise((resolve) => {
        ctx = {
          queue: (p: Promise<void>) => resolve()
        } as Context & IContext
        lifecycle = (middleware as Middleware)(ctx) as Iterator<void>
      })

      lifecycle.next()
      lifecycle.next()
      await queue
      expect(document.title).toBe('foo')
      lifecycle.next()
      lifecycle.next()
      expect(document.title).toBe('start')
    })
  })

})
