/* tslint:disable max-classes-per-file */

import 'jest'

import * as ko from 'knockout'
import { isPlainObject } from 'lodash'
import { DataModelConstructorBuilder } from './model/builders/DataModelConstructorBuilder'
import { ViewModelConstructorBuilder } from './model/builders/ViewModelConstructorBuilder'
import { Route } from './Route'
import { Context, IContext, Middleware } from '@profiscience/knockout-contrib-router'

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

  describe('with', () => {
    test('extends context with object passed to with', () => {
      const route = new Route('/foo', { with: { foo: 'bar' } })
      const [middleware] = route['/foo']
      const ctx = {} as Context & IContext

      (middleware as Middleware)(ctx)

      expect((ctx as any).foo).toBe('bar')
    })
  })

  describe('component', () => {
    test('sets component, disposes registration after render', async () => {
      ko.components.register = jest.fn()
      ko.components.unregister = jest.fn()

      const template = 'Hello, World!'
      const route = new Route('/', {
        component: () => ({
          // intended for use with import('./template.html')
          template: Promise.resolve({ default: template }),
          viewModel: Promise.resolve({
            default: class extends ViewModelConstructorBuilder {}
          })
        })
      })
      const queue = jest.fn()
      const [middleware] = route['/']
      const ctx = { queue: queue as any, route: {} } as Context & IContext
      const lifecycle = (middleware as Middleware)(ctx) as Iterator<void>

      lifecycle.next()

      await queue.mock.calls[0][0]

      const componentId = '__router_view_0__'
      const componentRegistrationArgs = (ko.components.register as jest.Mock).mock.calls[0]
      expect(ctx.route.component).toBe(componentId)
      expect(componentRegistrationArgs[0]).toBe(componentId)
      expect(componentRegistrationArgs[1].template).toBe(template)
      expect(componentRegistrationArgs[1].synchronous).toBe(true)
      expect(componentRegistrationArgs[1].viewModel.instance).toBeInstanceOf(ViewModelConstructorBuilder)

      lifecycle.next()

      expect(ko.components.unregister).lastCalledWith(componentId)
    })

    test('initializes DataModel properties on ViewModel', async () => {
      ko.components.register = jest.fn()

      class DataModel extends DataModelConstructorBuilder<{}> {
        public async fetch() {
          // force this to sleep so it will actually fail
          await new Promise((resolve) => setTimeout(resolve, 500))
          return { foo: 'bar' }
        }
      }

      const route = new Route('/', {
        component: () => ({
          template: Promise.resolve({ default: 'Hello, World!' }),
          viewModel: Promise.resolve({
            default: class extends ViewModelConstructorBuilder {
              public data = new DataModel({})
            }
          })
        })
      })

      const queue = jest.fn()
      const [middleware] = route['/']
      const ctx = { queue: queue as any, route: {} } as Context & IContext
      const lifecycle = (middleware as Middleware)(ctx) as Iterator<void>

      lifecycle.next()

      await queue.mock.calls[0][0]

      const instance = (ko.components.register as jest.Mock).mock.calls[0][1].viewModel.instance

      expect(instance.data.foo()).toBe('bar')
    })
  })
})
