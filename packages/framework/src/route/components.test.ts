import * as ko from 'knockout'
import { Context, IContext, IRouteConfig } from '@profiscience/knockout-contrib-router'

import { componentsPlugin } from './components'

describe('route components', () => {

  test('registers components before render', async () => {
    const queue = jest.fn()
    const registerComponent = jest.fn()
    const ctx = { queue: queue as (p: any) => void } as Context & IContext
    const viewModel = () => { /* noop */ }
    const routeConfig: IRouteConfig = {
      components: () => ({
        foo: Promise.resolve({ viewModel, template: 'foo' }),
        bar: Promise.resolve({ viewModel, template: 'bar' })
      })
    }
    const middleware = componentsPlugin(routeConfig)
    const lifecycle = middleware(ctx) as IterableIterator<void>

    ko.components.register = registerComponent

    lifecycle.next()

    await Promise.all(queue.mock.calls)

    expect(registerComponent).toHaveBeenCalledWith('foo', { viewModel, template: 'foo' })
    expect(registerComponent).toHaveBeenCalledWith('bar', { viewModel, template: 'bar' })

    lifecycle.next()
    lifecycle.next()
    lifecycle.next()
  })

  test('unregisters components before dispose', async () => {
    const queue = jest.fn()
    const unregisterComponent = jest.fn()
    const ctx = { queue: queue as (p: any) => void } as Context & IContext
    const viewModel = () => { /* noop */ }
    const routeConfig: IRouteConfig = {
      components: () => ({
        foo: Promise.resolve({ viewModel, template: 'foo' }),
        bar: Promise.resolve({ viewModel, template: 'bar' })
      })
    }
    const middleware = componentsPlugin(routeConfig)
    const lifecycle = middleware(ctx) as IterableIterator<void>

    ko.components.unregister = unregisterComponent

    lifecycle.next()

    await Promise.all(queue.mock.calls)

    lifecycle.next()

    expect(unregisterComponent).not.toBeCalled()

    lifecycle.next()

    expect(unregisterComponent).toHaveBeenCalledWith('foo')
    expect(unregisterComponent).toHaveBeenCalledWith('bar')
  })
})
