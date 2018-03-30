import * as ko from 'knockout'
import { Context, IContext, IRouteConfig } from '@profiscience/knockout-contrib-router'

import { componentsPlugin } from './index'

describe('router.plugins.components', () => {
  test('registers components before render', async () => {
    ko.components.register = jest.fn()
    ko.components.unregister = jest.fn()

    const helloWorldComponent = { template: 'Hello, World!' }
    const queue = jest.fn()
    const ctx = { queue: queue as any } as Context & IContext
    const routeConfig: IRouteConfig = {
      components: () => ({
        'hello-world': Promise.resolve(helloWorldComponent)
      })
    }
    const middleware = componentsPlugin(routeConfig)
    const lifecycle = middleware(ctx) as IterableIterator<void>

    lifecycle.next()
    await queue.mock.calls[0][0]
    // beforeRender
    expect(ko.components.register).lastCalledWith('hello-world', helloWorldComponent)

    lifecycle.next()
    // afterRender

    lifecycle.next()
    // beforeDispose
    expect(ko.components.unregister).lastCalledWith('hello-world')
  })

  test('doesn\'t blow up when not used', () => {
    const ctx = {} as Context & IContext
    const routeConfig: IRouteConfig = {}
    const middleware = componentsPlugin(routeConfig)
    const lifecycle = middleware(ctx) as IterableIterator<void>

    lifecycle.next()
    lifecycle.next()
    lifecycle.next()
    lifecycle.next()
  })
})
