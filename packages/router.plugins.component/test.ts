/* tslint:disable max-classes-per-file */

import * as ko from 'knockout'
import { Context, IContext, IRouteConfig, LifecycleGeneratorMiddleware } from '@profiscience/knockout-contrib-router'

import { componentPlugin, IRoutedComponentInstance, disableUninstantiableViewModelWarning } from './index'

const registerComponent = ko.components.register

afterEach(() => {
  ko.components.register = registerComponent
})

describe('router.plugins.component', () => {
  describe('warnings', () => {
    test('non-class viewModel', async () => {
      console.warn = jest.fn()

      const template = 'Hello, World!'
      const component = { template, viewModel: { createViewModel: () => ({}) } }
      const ctx = createMockContext()
      const routeConfig: IRouteConfig = { component } as any
      const middleware = componentPlugin(routeConfig) as LifecycleGeneratorMiddleware
      const lifecycle = middleware(ctx)

      lifecycle.next()

      await resolveQueue(ctx)

      expect(console.warn).toBeCalled()
    })

    test('named components', async () => {
      console.warn = jest.fn()

      const component = 'hello-world'
      const ctx = createMockContext()
      const routeConfig: IRouteConfig = { component } as any
      const middleware = componentPlugin(routeConfig) as LifecycleGeneratorMiddleware
      const lifecycle = middleware(ctx)

      lifecycle.next()

      await resolveQueue(ctx)

      expect(console.warn).toBeCalled()
    })

    test('can disable warning', async () => {
      console.warn = jest.fn()

      disableUninstantiableViewModelWarning()

      const template = 'Hello, World!'
      const component = { template, viewModel: { instance: {} } }
      const ctx = createMockContext()
      const routeConfig: IRouteConfig = { component } as any
      const middleware = componentPlugin(routeConfig) as LifecycleGeneratorMiddleware
      const lifecycle = middleware(ctx)

      await resolveQueue(ctx)

      lifecycle.next()

      expect(console.warn).not.toBeCalled()
    })
  })

  describe('anonymous components', () => {
    test('sync', async () => {
      ko.components.register = jest.fn()

      class ViewModel {}
      const template = 'Hello, World!'
      const component = { template, viewModel: ViewModel }
      const ctx = createMockContext()
      const routeConfig: IRouteConfig = { component }
      const middleware = componentPlugin(routeConfig) as LifecycleGeneratorMiddleware
      const lifecycle = middleware(ctx)

      lifecycle.next()

      await resolveQueue(ctx)

      expect(ko.components.register).toBeCalled()

      const [registeredComponentName, registeredComponent] = (ko.components.register as jest.Mock).mock.calls[0]
      expect(ctx.route.component).toBe((ctx.component as IRoutedComponentInstance).name)
      expect(ctx.route.component).toMatch(/__router_view_\d+__/)
      expect(registeredComponentName).toMatch(/__router_view_\d+__/)
      expect(registeredComponent.template).toBe(template)
      expect(registeredComponent.synchronous).toBe(true)
      expect(registeredComponent.viewModel.instance).toBeInstanceOf(ViewModel)
    })

    test('component: { template }', async () => {
      ko.components.register = jest.fn()

      const template = 'Hello, World!'
      const component = { template }
      const ctx = createMockContext()
      const routeConfig: IRouteConfig = { component }
      const middleware = componentPlugin(routeConfig) as LifecycleGeneratorMiddleware
      const lifecycle = middleware(ctx)

      lifecycle.next()

      await resolveQueue(ctx)

      expect(ko.components.register).toBeCalled()

      const [registeredComponentName, registeredComponent] = (ko.components.register as jest.Mock).mock.calls[0]
      expect(ctx.route.component).toBe((ctx.component as IRoutedComponentInstance).name)
      expect(ctx.route.component).toMatch(/__router_view_\d+__/)
      expect(registeredComponentName).toMatch(/__router_view_\d+__/)
      expect(registeredComponent.template).toBe(template)
      expect(registeredComponent.synchronous).toBe(true)
    })

    test('component: () => ({ template: Promise<string>, viewModel: Promise<any> })', async () => {
      ko.components.register = jest.fn()

      class ViewModel {}
      const template = 'Hello, World!'
      const getComponent = () => ({
        // intended for use with import('./template.html')
        template: Promise.resolve(template),
        viewModel: Promise.resolve(ViewModel)
      })
      const ctx = createMockContext()
      const routeConfig: IRouteConfig = { component: getComponent }
      const middleware = componentPlugin(routeConfig) as LifecycleGeneratorMiddleware
      const lifecycle = middleware(ctx)

      lifecycle.next()

      await resolveQueue(ctx)

      const [registeredComponentName, registeredComponent] = (ko.components.register as jest.Mock).mock.calls[0]
      expect(ctx.route.component).toBe((ctx.component as IRoutedComponentInstance).name)
      expect(ctx.route.component).toMatch(/__router_view_\d+__/)
      expect(registeredComponentName).toMatch(/__router_view_\d+__/)
      expect(registeredComponent.template).toBe(template)
      expect(registeredComponent.synchronous).toBe(true)
      expect(registeredComponent.viewModel.instance).toBeInstanceOf(ViewModel)
    })

    // tslint:disable-next-line:max-line-length
    test('component: () => { template: Promise<{ default: string>, viewModel: Promise<{ default: any }>  }', async () => {
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
      const middleware = componentPlugin(routeConfig) as LifecycleGeneratorMiddleware
      const lifecycle = middleware(ctx)

      lifecycle.next()

      await ctx.component

      const [registeredComponentName, registeredComponent] = (ko.components.register as jest.Mock).mock.calls[0]
      expect(ctx.route.component).toBe((ctx.component as IRoutedComponentInstance).name)
      expect(ctx.route.component).toMatch(/__router_view_\d+__/)
      expect(registeredComponentName).toMatch(/__router_view_\d+__/)
      expect(registeredComponent.template).toBe(template)
      expect(registeredComponent.synchronous).toBe(true)
      expect(registeredComponent.viewModel.instance).toBeInstanceOf(ViewModel)
    })

    test('component: () => Promise<{ default: { template, viewModel } }>', async () => {
      ko.components.register = jest.fn()

      class ViewModel {}
      const template = 'Hello, World!'
      const getComponent = () => Promise.resolve({
        // e.g. `component: import('./component`)`, where component.ts is `export default { template, viewModel }`
        // instead named template and viewModel exports
        default: {
          template,
          viewModel: ViewModel
        }
      })
      const ctx = { queue: jest.fn() as any, route: {} } as Context & IContext
      const routeConfig: IRouteConfig = { component: getComponent }
      const middleware = componentPlugin(routeConfig) as LifecycleGeneratorMiddleware
      const lifecycle = middleware(ctx)

      lifecycle.next()

      await ctx.component

      const [registeredComponentName, registeredComponent] = (ko.components.register as jest.Mock).mock.calls[0]
      expect(ctx.route.component).toBe((ctx.component as IRoutedComponentInstance).name)
      expect(ctx.route.component).toMatch(/__router_view_\d+__/)
      expect(registeredComponentName).toMatch(/__router_view_\d+__/)
      expect(registeredComponent.template).toBe(template)
      expect(registeredComponent.synchronous).toBe(true)
      expect(registeredComponent.viewModel.instance).toBeInstanceOf(ViewModel)
    })

    test('comopnent: () => Promise<{ template, viewModel }>', async () => {
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
      const middleware = componentPlugin(routeConfig) as LifecycleGeneratorMiddleware
      const lifecycle = middleware(ctx)

      lifecycle.next()

      await ctx.component

      const [registeredComponentName, registeredComponent] = (ko.components.register as jest.Mock).mock.calls[0]
      expect(ctx.route.component).toMatch(/__router_view_\d+__/)
      expect(registeredComponentName).toMatch(/__router_view_\d+__/)
      expect(registeredComponent.template).toBe(template)
      expect(registeredComponent.synchronous).toBe(true)
      expect(registeredComponent.viewModel.instance).toBeInstanceOf(ViewModel)
    })

    test('specifying component name', async () => {
      ko.components.register = jest.fn()

      class ViewModel {}
      const template = 'Hello, World!'
      const component = { template, viewModel: ViewModel, name: 'my-awesome-component' }
      const ctx = createMockContext()
      const routeConfig: IRouteConfig = { component }
      const middleware = componentPlugin(routeConfig) as LifecycleGeneratorMiddleware
      const lifecycle = middleware(ctx)

      lifecycle.next()

      await resolveQueue(ctx)

      expect(ko.components.register).toBeCalled()

      const [registeredComponentName] = (ko.components.register as jest.Mock).mock.calls[0]
      expect(ctx.route.component).toBe('my-awesome-component')
      expect(registeredComponentName).toBe('my-awesome-component')
    })

    test('ctx.component.viewModel is viewModel instance', async () => {
      ko.components.register = jest.fn()

      class ViewModel {
        public itsMe = true
      }
      const template = 'Hello, World!'
      const component = { template, viewModel: ViewModel }
      const ctx = createMockContext()
      const routeConfig: IRouteConfig = { component }
      const middleware = componentPlugin(routeConfig) as LifecycleGeneratorMiddleware
      const lifecycle = middleware(ctx)

      lifecycle.next()
      await resolveQueue(ctx)

      expect((ctx.component as IRoutedComponentInstance).viewModel.itsMe).toBe(true)
    })

    test('doesn\'t die if view model doesn\'t have dispose function', async () => {
      class ViewModel {}

      const template = 'Hello, World!'
      const component = { template, viewModel: ViewModel }
      const ctx = createMockContext()
      const routeConfig: IRouteConfig = { component }
      const middleware = componentPlugin(routeConfig) as LifecycleGeneratorMiddleware
      const lifecycle = middleware(ctx)

      lifecycle.next()
      await resolveQueue(ctx)
      lifecycle.next()
      expect(() => lifecycle.next()).not.toThrow()
    })

    test('disposes component registration after render', async () => {
      ko.components.unregister = jest.fn()

      class ViewModel {}
      const template = 'Hello, World!'
      const component = { template, viewModel: ViewModel }
      const ctx = createMockContext()
      const routeConfig: IRouteConfig = { component }
      const middleware = componentPlugin(routeConfig) as LifecycleGeneratorMiddleware
      const lifecycle = middleware(ctx)

      lifecycle.next()
      await resolveQueue(ctx)
      lifecycle.next()

      expect(ko.components.unregister).lastCalledWith((ctx.component as IRoutedComponentInstance).name)
    })
  })

  describe('named components', () => {
    test('sync', async () => {
      const ctx = createMockContext()
      const name = 'my-component-1'
      const routeConfig: IRouteConfig = { component: 'my-component-1' }
      const middleware = componentPlugin(routeConfig) as LifecycleGeneratorMiddleware
      const lifecycle = middleware(ctx)

      lifecycle.next()
      await resolveQueue(ctx)

      expect(ctx.route.component).toBe(name)
    })

    test('sync accessor', async () => {
      const ctx = createMockContext()
      const name = 'my-component-2'
      const routeConfig: IRouteConfig = {
        component: (_ctx) => {
          expect(_ctx).toEqual(ctx)
          return name
        }
      }
      const middleware = componentPlugin(routeConfig) as LifecycleGeneratorMiddleware
      const lifecycle = middleware(ctx)

      lifecycle.next()
      await resolveQueue(ctx)

      expect(ctx.route.component).toBe(name)
    })

    test('async accessor', async () => {
      const ctx = createMockContext()
      const name = 'my-component-3'
      const routeConfig: IRouteConfig = {
      component: (_ctx) => {
          expect(_ctx).toEqual(ctx)
          return Promise.resolve(name)
        }
      }
      const middleware = componentPlugin(routeConfig) as LifecycleGeneratorMiddleware
      const lifecycle = middleware(ctx)

      lifecycle.next()
      await resolveQueue(ctx)

      expect(ctx.route.component).toBe(name)
    })
  })

  test('doesn\'t blow up when not used', () => {
    const routeConfig: IRouteConfig = {}
    const middleware = componentPlugin(routeConfig)
    expect(middleware).toBeUndefined()
  })
})

function createMockContext() {
  return { route: {}, queue: jest.fn() as any } as Context & IContext
}

function resolveQueue(ctx: Context) {
  const queue = ctx.queue as jest.Mock
  return Promise.all(queue.mock.calls.map(([p]) => p))
}
