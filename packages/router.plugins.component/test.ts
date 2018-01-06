/* tslint:disable max-classes-per-file */

import * as ko from 'knockout'
import { Context, IContext, IRouteConfig } from '@profiscience/knockout-contrib-router'

import { componentPlugin, IRoutedComponentConfig, IRoutedComponentInstance } from './'

const uniqueComponentNames = (function*() {
  let i = 0
  while (true) {
    const id = `__router_view_${i++}__`
    if (ko.components.isRegistered(id)) continue
    yield id
  }
})()

let componentId: string

beforeEach(() => {
  componentId = uniqueComponentNames.next().value
})

describe('router.plugins.component', () => {
  test('registers sync component', () => {
    ko.components.register = jest.fn()

    class ViewModel {}
    const template = 'Hello, World!'
    const component = { template, viewModel: ViewModel }
    const ctx = { route: {} } as Context & IContext
    const routeConfig: IRouteConfig = { component }
    const middleware = componentPlugin(routeConfig)
    const lifecycle = middleware(ctx)

    lifecycle.next()

    const [registeredComponentName, registeredComponent] = (ko.components.register as jest.Mock).mock.calls[0]
    expect(ctx.route.component).toBe(componentId)
    expect(registeredComponentName).toBe(componentId)
    expect(registeredComponent.template).toBe(template)
    expect(registeredComponent.synchronous).toBe(true)
    expect(registeredComponent.viewModel.instance).toBeInstanceOf(ViewModel)
  })

  test('works with async component, ctx.component is promise while pending', async () => {
    ko.components.register = jest.fn()

    class ViewModel {}
    const template = 'Hello, World!'
    const getComponent = () => ({
      // intended for use with import('./template.html')
      template: Promise.resolve({ default: template }),
      viewModel: Promise.resolve({
        default: ViewModel
      })
    })
    const ctx = { queue: jest.fn() as any, route: {} } as Context & IContext
    const routeConfig: IRouteConfig = { component: getComponent }
    const middleware = componentPlugin(routeConfig)
    const lifecycle = middleware(ctx)

    lifecycle.next()

    await ctx.component

    const [registeredComponentName, registeredComponent] = (ko.components.register as jest.Mock).mock.calls[0]
    expect(ctx.route.component).toBe(componentId)
    expect(registeredComponentName).toBe(componentId)
    expect(registeredComponent.template).toBe(template)
    expect(registeredComponent.synchronous).toBe(true)
    expect(registeredComponent.viewModel.instance).toBeInstanceOf(ViewModel)
  })

  test('ctx.component.viewModel is viewModel instance', () => {
    ko.components.register = jest.fn()

    class ViewModel {
      public itsMe = true
    }
    const template = 'Hello, World!'
    const component = { template, viewModel: ViewModel }
    const ctx = { route: {} } as Context & IContext
    const routeConfig: IRouteConfig = { component }
    const middleware = componentPlugin(routeConfig)
    const lifecycle = middleware(ctx)

    lifecycle.next()

    expect((ctx.component as IRoutedComponentInstance).viewModel.itsMe).toBe(true)
  })

  test('ctx.component resolves ctx.component value with async', async () => {
    class ViewModel {
      public itsMe = true
    }
    const template = 'Hello, World!'
    const getComponent = () => ({
      // intended for use with import('./template.html')
      template: Promise.resolve({ default: template }),
      viewModel: Promise.resolve({
        default: ViewModel
      })
    })
    const ctx = { queue: jest.fn() as any, route: {} } as Context & IContext
    const routeConfig: IRouteConfig = { component: getComponent }
    const middleware = componentPlugin(routeConfig)
    const lifecycle = middleware(ctx)

    lifecycle.next()

    const component = await ctx.component

    expect(component.viewModel.itsMe).toBe(true)
  })

  test('disposes component registration after render', () => {
    ko.components.unregister = jest.fn()

    class ViewModel {}
    const template = 'Hello, World!'
    const component = { template, viewModel: ViewModel }
    const ctx = { route: {} } as Context & IContext
    const routeConfig: IRouteConfig = { component }
    const middleware = componentPlugin(routeConfig)
    const lifecycle = middleware(ctx)

    lifecycle.next()
    lifecycle.next()

    expect(ko.components.unregister).lastCalledWith(componentId)
  })
})
