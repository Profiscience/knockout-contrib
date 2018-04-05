/* tslint:disable max-classes-per-file */

import * as ko from 'knockout'
import { Context, IContext, IRouteConfig } from '@profiscience/knockout-contrib-router'

import { componentPlugin, IRoutedComponentInstance } from './index'

const uniqueComponentNames = (function*() {
  let i = 0
  while (true) {
    const id = `__router_view_${i++}__`
    if (ko.components.isRegistered(id)) continue
    yield id
  }
})()

let componentId: string
const registerComponent = ko.components.register

beforeEach(() => {
  componentId = uniqueComponentNames.next().value
})

afterEach(() => {
  ko.components.register = registerComponent
})

describe('router.plugins.component', () => {
  test('logs warning if viewModel is not newable', () => {
    console.warn = jest.fn()

    const template = 'Hello, World!'
    const component = { template, viewModel: { instance: {} } }
    const ctx = { route: {} } as Context & IContext
    const routeConfig: IRouteConfig = { component } as any
    const middleware = componentPlugin(routeConfig)
    const lifecycle = middleware(ctx)

    lifecycle.next()

    expect(console.warn).toBeCalled()
  })

  describe('anonymous components', () => {
    test('sync', () => {
      ko.components.register = jest.fn()

      class ViewModel {}
      const template = 'Hello, World!'
      const component = { template, viewModel: ViewModel }
      const ctx = { route: {} } as Context & IContext
      const routeConfig: IRouteConfig = { component }
      const middleware = componentPlugin(routeConfig)
      const lifecycle = middleware(ctx)

      lifecycle.next()

      expect(ko.components.register).toBeCalled()

      const [registeredComponentName, registeredComponent] = (ko.components.register as jest.Mock).mock.calls[0]
      expect(ctx.route.component).toBe(componentId)
      expect(registeredComponentName).toBe(componentId)
      expect(registeredComponent.template).toBe(template)
      expect(registeredComponent.synchronous).toBe(true)
      expect(registeredComponent.viewModel.instance).toBeInstanceOf(ViewModel)
    })

    test('sync, template only', () => {
      ko.components.register = jest.fn()

      const template = 'Hello, World!'
      const component = { template }
      const ctx = { route: {} } as Context & IContext
      const routeConfig: IRouteConfig = { component }
      const middleware = componentPlugin(routeConfig)
      const lifecycle = middleware(ctx)

      lifecycle.next()

      expect(ko.components.register).toBeCalled()

      const [registeredComponentName, registeredComponent] = (ko.components.register as jest.Mock).mock.calls[0]
      expect(ctx.route.component).toBe(componentId)
      expect(registeredComponentName).toBe(componentId)
      expect(registeredComponent.template).toBe(template)
      expect(registeredComponent.synchronous).toBe(true)
    })

    test('sync accessor, async values', async () => {
      ko.components.register = jest.fn()

      class ViewModel {}
      const template = 'Hello, World!'
      const getComponent = () => ({
        // intended for use with import('./template.html')
        template: Promise.resolve(template),
        viewModel: Promise.resolve(ViewModel)
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

    test('sync accessor, async values, default imports', async () => {
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

    test('async accessor', async () => {
      ko.components.register = jest.fn()

      class ViewModel {}
      const template = 'Hello, World!'
      const getComponent = () => Promise.resolve({
        // intended for use with import('./component')
        template,
        viewModel: ViewModel
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

    test('patches viewModel dispose to run beforeDispose', () => {
      const dispose = jest.fn()

      class ViewModel {
        public dispose = dispose
      }

      const template = 'Hello, World!'
      const component = { template, viewModel: ViewModel }
      const ctx = { route: {} } as Context & IContext
      const routeConfig: IRouteConfig = { component }
      const middleware = componentPlugin(routeConfig)
      const lifecycle = middleware(ctx)

      lifecycle.next()
      lifecycle.next()
      expect(dispose).not.toBeCalled()
      const instance = ctx.component as IRoutedComponentInstance
      lifecycle.next()
      expect(dispose).toHaveBeenCalledTimes(1)
      instance.viewModel.dispose()
      expect(dispose).toHaveBeenCalledTimes(1)
    })

    test('doesn\'t die if view model doesn\'t have dispose function', () => {
      class ViewModel {}

      const template = 'Hello, World!'
      const component = { template, viewModel: ViewModel }
      const ctx = { route: {} } as Context & IContext
      const routeConfig: IRouteConfig = { component }
      const middleware = componentPlugin(routeConfig)
      const lifecycle = middleware(ctx)

      lifecycle.next()
      lifecycle.next()
      expect(() => lifecycle.next()).not.toThrow()
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

  describe.only('named components', () => {
    test('sync', (done) => {
      expect.assertions(3)

      const ctx = { route: {} } as Context & IContext
      const name = 'my-component-1'
      const params = { foo: 'bar' }
      const routeConfig: IRouteConfig = {
        component: {
          name,
          params
        }
      }

      ko.components.register(name, {
        template: 'Hello, World!',
        viewModel: class {
          constructor(actual: any) {
            expect(actual).toBe(params)
            done()
          }
        }
      })

      const middleware = componentPlugin(routeConfig)
      const lifecycle = middleware(ctx)

      lifecycle.next()

      const wrapperComponentName = ctx.route.component
      const el = document.createElement('div')

      expect(ko.components.isRegistered(wrapperComponentName)).toBe(true)

      ko.applyBindings({}, el)
      ko.applyBindingsToNode(el, {
        component: {
          name: wrapperComponentName,
          params: ctx
        }
      })

      ko.components.unregister(name)

      expect(el.firstChild).not.toBeNull()
    })

    test('sync accessor', (done) => {
      const ctx = { route: {} } as Context & IContext
      const name = 'my-component-2'
      const params = { foo: 'bar' }
      const routeConfig: IRouteConfig = {
        component: (_ctx) => {
          expect(_ctx).toEqual(ctx)
          return {
            name,
            params
          }
        }
      }

      ko.components.register(name, {
        template: 'Hello, World!',
        viewModel: class {
          constructor(actual: any) {
            expect(actual).toBe(params)
            done()
          }
        }
      })

      const middleware = componentPlugin(routeConfig)
      const lifecycle = middleware(ctx)

      lifecycle.next()

      const wrapperComponentName = ctx.route.component
      const el = document.createElement('div')

      expect(ko.components.isRegistered(wrapperComponentName)).toBe(true)

      ko.applyBindings({}, el)
      ko.applyBindingsToNode(el, {
        component: {
          name: wrapperComponentName,
          params: ctx
        }
      })

      ko.components.unregister(name)

      expect(el.firstChild).not.toBeNull()
    })

    test('disposes component registration after render', (done) => {
      const ctx = { route: {} } as Context & IContext
      const name = 'my-component-3'
      const params = { foo: 'bar' }
      const routeConfig: IRouteConfig = {
        component: {
          name,
          params
        }
      }

      ko.components.register(name, {
        template: 'Hello, World!',
        viewModel: class {
          constructor() {
            ko.components.unregister(name)
            expect(ko.components.isRegistered(wrapperComponentName)).toBe(false)
            done()
          }
        }
      })

      const middleware = componentPlugin(routeConfig)
      const lifecycle = middleware(ctx)

      lifecycle.next()

      const wrapperComponentName = ctx.route.component
      const el = document.createElement('div')

      ko.applyBindings({}, el)
      ko.applyBindingsToNode(el, { component: { name: wrapperComponentName } })
    })

    test('params are optional', (done) => {
      const ctx = { route: {}, foo: 'foo' } as any
      const name = 'my-component-4'
      const routeConfig: IRouteConfig = {
        component: {
          name
        }
      }

      ko.components.register(name, {
        template: 'Hello, World!',
        viewModel: class {
          constructor(params: any) {
            expect(params).toEqual({})
            done()
          }
        }
      })

      const middleware = componentPlugin(routeConfig)
      const lifecycle = middleware(ctx)

      lifecycle.next()

      const wrapperComponentName = ctx.route.component
      const el = document.createElement('div')

      ko.applyBindings({}, el)
      ko.applyBindingsToNode(el, {
        component: {
          name: wrapperComponentName,
          params: ctx
        }
      })

      ko.components.unregister(name)
    })
  })

  test('doesn\'t blow up when not used', () => {
    const ctx = {} as Context & IContext
    const routeConfig: IRouteConfig = {}
    const middleware = componentPlugin(routeConfig)
    const lifecycle = middleware(ctx) as IterableIterator<void>

    expect(() => {
      lifecycle.next()
      lifecycle.next()
      lifecycle.next()
      lifecycle.next()
    }).not.toThrow()
  })
})
