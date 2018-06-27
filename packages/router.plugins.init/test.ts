/* tslint:disable max-classes-per-file */

import { Context, Route, IContext, IRouteConfig } from '@profiscience/knockout-contrib-router'
import { componentPlugin } from '@profiscience/knockout-contrib-router-plugins-component'

import { initializerPlugin, INITIALIZED } from './index'

Route
  .usePlugin(componentPlugin)
  // must come after component plugin. b/c of this can not be registered with global middleware.
  .usePlugin(initializerPlugin)

describe('router.plugins.init', () => {
  test('works with router.plugins.component, initializes props with INITIALIZED key on ViewModel', async () => {
    const spy = jest.spyOn(Promise, 'all')
    const promise = Promise.resolve()

    const getComponent = () => ({
      template: Promise.resolve({ default: 'Hello, World!' }),
      viewModel: Promise.resolve({
        default: class {
          public data = {
            [INITIALIZED]: promise
          }
        }
      })
    })

    const queue = jest.fn()
    const routeConfig: IRouteConfig = { component: getComponent }
    const route = new Route('/', routeConfig)
    const ctx = { queue: queue as any, route: {} } as Context & IContext

    for (const middleware of route.middleware) {
      const lifecycle = middleware(ctx) as IterableIterator<void>
      if (lifecycle) lifecycle.next()
    }

    await Promise.all(queue.mock.calls.map(([p]) => p))

    await ctx.component

    expect(spy).toBeCalledWith([promise])
  })

  test('works with router.plugins.component, initializes INITIALIZED key on ViewModel', async () => {
    const spy = jest.spyOn(Promise, 'all')
    const promise = Promise.resolve()

    const getComponent = () => ({
      template: Promise.resolve({ default: 'Hello, World!' }),
      viewModel: Promise.resolve({
        default: class {
          public [INITIALIZED] = promise
        }
      })
    })

    const queue = jest.fn()
    const routeConfig: IRouteConfig = { component: getComponent }
    const route = new Route('/', routeConfig)
    const ctx = { queue: queue as any, route: {} } as Context & IContext

    for (const middleware of route.middleware) {
      const lifecycle = middleware(ctx) as IterableIterator<void>
      if (lifecycle) lifecycle.next()
    }

    await Promise.all(queue.mock.calls.map(([p]) => p))

    await ctx.component

    expect(spy).toBeCalledWith([promise])
  })

  test('doesn\'t blow up when no component', async () => {
    const queue = jest.fn()
    const routeConfig: IRouteConfig = {}
    const route = new Route('/', routeConfig)
    const ctx = { queue: queue as any, route: {} } as Context & IContext

    for (const middleware of route.middleware) {
      const lifecycle = middleware(ctx) as IterableIterator<void>
      if (lifecycle) lifecycle.next()
    }

    expect(queue).not.toBeCalled()
  })

  test('doesn\'t blow up when no viewModel', async () => {
    const queue = jest.fn()
    const getComponent = () => ({
      template: Promise.resolve({ default: 'Hello, World!' })
    })
    const routeConfig: IRouteConfig = { component: getComponent }
    const route = new Route('/', routeConfig)
    const ctx = { queue: queue as any, route: {} } as Context & IContext

    expect(() => {
      for (const middleware of route.middleware) {
        const lifecycle = middleware(ctx) as IterableIterator<void>
        if (lifecycle) lifecycle.next()
      }
    }).not.toThrow()
  })

  test('doesn\'nt blow up with defined properties w/ undefined values (see comment in test file)', async () => {
    /**
     * It's not only possible, but common to have a property whose descriptor has been defined, but
     * whose value is undefined. In this case, Object.keys and the like *still* return those property descriptors.
     *
     * If none of this makes any sense, this is what I'm talking about...
     *
     *  const obj = {
     *    foo: undefined
     *  }
     *
     *  Object.keys(obj) // ['foo']
     */

    const queue = jest.fn()
    const component = {
      template: 'Hello, World!',
      viewModel: class { public foo = undefined }
    }
    const routeConfig: IRouteConfig = { component }
    const route = new Route('/', routeConfig)
    const ctx = { queue: queue as any, route: {} } as Context & IContext

    for (const middleware of route.middleware) {
      const lifecycle = middleware(ctx) as IterableIterator<void>
      if (lifecycle) lifecycle.next()
    }

    await expect(Promise.all(queue.mock.calls.map(([p]) => p))).resolves.toBeTruthy()
  })

  test('doesn\'nt blow up with null props', async () => {
    /**
     * `TypeError: Cannot read property 'foo` of null`
     */

    const queue = jest.fn()
    const component = {
      template: 'Hello, World!',
      viewModel: class { public foo = null }
    }
    const routeConfig: IRouteConfig = { component }
    const route = new Route('/', routeConfig)
    const ctx = { queue: queue as any, route: {} } as Context & IContext

    for (const middleware of route.middleware) {
      const lifecycle = middleware(ctx) as IterableIterator<void>
      if (lifecycle) lifecycle.next()
    }

    await expect(Promise.all(queue.mock.calls.map(([p]) => p))).resolves.toBeTruthy()
  })
})