/* tslint:disable max-classes-per-file */

import * as ko from 'knockout'
import { Context, Route, IContext, IRouteConfig } from '@profiscience/knockout-contrib-router'
import { componentPlugin } from '@profiscience/knockout-contrib-router-plugins-component'

import { dataPlugin, INITIALIZED } from './index'

Route
  .usePlugin(componentPlugin)
  // must come after component plugin. b/c of this can not be registered with global middleware.
  .usePlugin(dataPlugin)

describe('router.plugins.init', () => {
  test('works with router.plugins.component, initializes props with INITIALIZED prop on ViewModel', async () => {
    const spy = jest.spyOn(Promise, 'all')
    const p = Promise.resolve()

    const getComponent = () => ({
      template: Promise.resolve({ default: 'Hello, World!' }),
      viewModel: Promise.resolve({
        default: class {
          public data = {
            [INITIALIZED]: p
          }
        }
      })
    })

    const queue = jest.fn()
    const routeConfig: IRouteConfig = { component: getComponent }
    const route = new Route('/', routeConfig)
    const ctx = { queue: queue as any, route: {} } as Context & IContext

    for (const middleware of route.middleware) {
      const lifecycle = middleware(ctx)
      if (lifecycle) lifecycle.next()
    }

    await Promise.all(queue.mock.calls.map(([p]) => p))

    const componentInstance = await ctx.component

    expect(spy).toBeCalledWith([p])
  })

  test('doesn\'t blow up when no component', async () => {
    const queue = jest.fn()
    const routeConfig: IRouteConfig = {}
    const route = new Route('/', routeConfig)
    const ctx = { queue: queue as any, route: {} } as Context & IContext

    for (const middleware of route.middleware) {
      const lifecycle = middleware(ctx)
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
        const lifecycle = middleware(ctx)
        if (lifecycle) lifecycle.next()
      }
    }).not.toThrow()
  })
})
