/* tslint:disable max-classes-per-file */

import * as ko from 'knockout'
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-framework-model-builders-data'
import { ViewModelConstructorBuilder } from '@profiscience/knockout-contrib-framework-model-builders-view'
import { Context, Route, IContext, IRouteConfig } from '@profiscience/knockout-contrib-router'
import { componentPlugin } from '@profiscience/knockout-contrib-router-plugins-component'

import { frameworkPlugin } from './index'

Route
  .usePlugin(componentPlugin)
  // must come after component plugin. b/c of this can not be registered with global middleware.
  .usePlugin(frameworkPlugin)

describe('framework.plugin', () => {
  test('works with router.plugins.component, initializes DataModel properties on ViewModel', async () => {
    class DataModel extends DataModelConstructorBuilder<{}> {
      public async fetch() {
        // force this to sleep so it will actually fail
        await new Promise((resolve) => setTimeout(resolve, 500))
        return { foo: 'bar' }
      }
    }

    const getComponent = () => ({
      template: Promise.resolve({ default: 'Hello, World!' }),
      viewModel: Promise.resolve({
        default: class extends ViewModelConstructorBuilder {
          public data = new DataModel({})
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

    expect(componentInstance.viewModel.data.foo()).toBe('bar')
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
