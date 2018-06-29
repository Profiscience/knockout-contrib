import * as ko from 'knockout'
import {
  Context,
  IContext,
  Route,
  Lifecycle
} from '@profiscience/knockout-contrib-router'

import { componentsRoutePlugin } from './index'

Route.usePlugin(componentsRoutePlugin)

describe('router.plugins.components', () => {
  test('registers components before render', async () => {
    ko.components.register = jest.fn()
    ko.components.unregister = jest.fn()

    const helloWorldComponent = { template: 'Hello, World!' }
    const queue = jest.fn()
    const ctx = { queue: queue as any } as Context & IContext
    const route = new Route('/', {
      components: () => ({
        'hello-world': Promise.resolve(helloWorldComponent)
      })
    })
    const [middleware] = route.middleware
    const lifecycle = middleware(ctx) as Lifecycle

    if (lifecycle.beforeRender) lifecycle.beforeRender()
    await queue.mock.calls[0][0]
    // beforeRender
    expect(ko.components.register).lastCalledWith(
      'hello-world',
      helloWorldComponent
    )

    if (lifecycle.beforeDispose) lifecycle.beforeDispose()
    // beforeDispose
    expect(ko.components.unregister).lastCalledWith('hello-world')
  })

  test("doesn't blow up when not used", () => {
    const route = new Route('/', {})
    expect(route.middleware.length).toBe(0)
  })
})
