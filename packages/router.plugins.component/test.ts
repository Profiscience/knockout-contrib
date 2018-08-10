/* tslint:disable max-classes-per-file */

import * as ko from 'knockout'
import {
  Context,
  IContext,
  IRouteConfig,
  Lifecycle,
  Route
} from '@profiscience/knockout-contrib-router'

import {
  componentRoutePlugin,
  IRoutedComponentInstance,
  disableUninstantiableViewModelWarning
} from './index'

Route.usePlugin(componentRoutePlugin)

const registerComponent = ko.components.register
afterEach(() => {
  ko.components.register = registerComponent
})

describe('router.plugins.component', () => {
  describe('warnings', () => {
    test('non-class viewModel', async () => {
      // tslint:disable-next-line:no-console
      console.warn = jest.fn()

      const template = 'Hello, World!'
      const component = { template, viewModel: { createViewModel: () => ({}) } }
      const route = new Route('/', { component } as any)
      const ctx = createMockContext(route)
      const [middleware] = route.middleware
      const lifecycle = middleware(ctx) as Lifecycle

      if (lifecycle.beforeRender) lifecycle.beforeRender()

      await resolveQueue(ctx)

      // tslint:disable-next-line:no-console
      expect(console.warn).toBeCalled()
    })

    test('named components', async () => {
      // tslint:disable-next-line:no-console
      console.warn = jest.fn()

      const component = 'hello-world'
      const route = new Route('/', { component })
      const ctx = createMockContext(route)
      const [middleware] = route.middleware
      const lifecycle = middleware(ctx) as Lifecycle

      if (lifecycle.beforeRender) lifecycle.beforeRender()

      await resolveQueue(ctx)

      // tslint:disable-next-line:no-console
      expect(console.warn).toBeCalled()
    })

    test('can disable warning', async () => {
      // tslint:disable-next-line:no-console
      console.warn = jest.fn()

      disableUninstantiableViewModelWarning()

      const template = 'Hello, World!'
      const component = { template, viewModel: { instance: {} } }
      const route = new Route('/', { component } as any)
      const ctx = createMockContext(route)
      const [middleware] = route.middleware
      const lifecycle = middleware(ctx) as Lifecycle

      await resolveQueue(ctx)

      if (lifecycle.beforeRender) lifecycle.beforeRender()

      // tslint:disable-next-line:no-console
      expect(console.warn).not.toBeCalled()
    })
  })

  describe('anonymous components', () => {
    test('sync', async () => {
      ko.components.register = jest.fn()

      class ViewModel {}
      const template = 'Hello, World!'
      const component = { template, viewModel: ViewModel }
      const route = new Route('/', { component })
      const ctx = createMockContext(route)
      const [middleware] = route.middleware
      const lifecycle = middleware(ctx) as Lifecycle

      if (lifecycle.beforeRender) lifecycle.beforeRender()

      await resolveQueue(ctx)

      expect(ko.components.register).toBeCalled()

      const [registeredComponentName, registeredComponent] = (ko.components
        .register as jest.Mock).mock.calls[0]
      expect(route.component).toBe(
        (ctx.component as IRoutedComponentInstance).name
      )

      expect(route.component).toMatch(/__router_view_\d+__/)
      expect(registeredComponentName).toMatch(/__router_view_\d+__/)
      expect(registeredComponent.template).toBe(template)
      expect(registeredComponent.synchronous).toBe(true)
      expect(registeredComponent.viewModel.instance).toBeInstanceOf(ViewModel)
    })

    test('component: { template }', async () => {
      ko.components.register = jest.fn()

      const template = 'Hello, World!'
      const component = { template }
      const route = new Route('/', { component })
      const ctx = createMockContext(route)
      const [middleware] = route.middleware
      const lifecycle = middleware(ctx) as Lifecycle

      if (lifecycle.beforeRender) lifecycle.beforeRender()

      await resolveQueue(ctx)

      expect(ko.components.register).toBeCalled()

      const [registeredComponentName, registeredComponent] = (ko.components
        .register as jest.Mock).mock.calls[0]
      expect(route.component).toBe(
        (ctx.component as IRoutedComponentInstance).name
      )
      expect(route.component).toMatch(/__router_view_\d+__/)
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
      const route = new Route('/', { component: getComponent })
      const ctx = createMockContext(route)
      const [middleware] = route.middleware
      const lifecycle = middleware(ctx) as Lifecycle

      if (lifecycle.beforeRender) lifecycle.beforeRender()

      await resolveQueue(ctx)

      const [registeredComponentName, registeredComponent] = (ko.components
        .register as jest.Mock).mock.calls[0]
      expect(route.component).toBe(
        (ctx.component as IRoutedComponentInstance).name
      )
      expect(route.component).toMatch(/__router_view_\d+__/)
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
      const route = new Route('/', { component: getComponent })
      const ctx = { queue: jest.fn() as any, route } as Context & IContext
      const [middleware] = route.middleware
      const lifecycle = middleware(ctx) as Lifecycle

      if (lifecycle.beforeRender) lifecycle.beforeRender()

      await ctx.component

      const [registeredComponentName, registeredComponent] = (ko.components
        .register as jest.Mock).mock.calls[0]
      expect(route.component).toBe(
        (ctx.component as IRoutedComponentInstance).name
      )
      expect(route.component).toMatch(/__router_view_\d+__/)
      expect(registeredComponentName).toMatch(/__router_view_\d+__/)
      expect(registeredComponent.template).toBe(template)
      expect(registeredComponent.synchronous).toBe(true)
      expect(registeredComponent.viewModel.instance).toBeInstanceOf(ViewModel)
    })

    test('component: () => Promise<{ default: { template, viewModel } }>', async () => {
      ko.components.register = jest.fn()

      class ViewModel {}
      const template = 'Hello, World!'
      const getComponent = () =>
        Promise.resolve({
          // e.g. `component: import('./component`)`, where component.ts is `export default { template, viewModel }`
          // instead named template and viewModel exports
          default: {
            template,
            viewModel: ViewModel
          }
        })
      const route = new Route('/', { component: getComponent })
      const ctx = { queue: jest.fn() as any, route } as Context & IContext
      const [middleware] = route.middleware
      const lifecycle = middleware(ctx) as Lifecycle

      if (lifecycle.beforeRender) lifecycle.beforeRender()

      await ctx.component

      const [registeredComponentName, registeredComponent] = (ko.components
        .register as jest.Mock).mock.calls[0]
      expect(route.component).toBe(
        (ctx.component as IRoutedComponentInstance).name
      )
      expect(route.component).toMatch(/__router_view_\d+__/)
      expect(registeredComponentName).toMatch(/__router_view_\d+__/)
      expect(registeredComponent.template).toBe(template)
      expect(registeredComponent.synchronous).toBe(true)
      expect(registeredComponent.viewModel.instance).toBeInstanceOf(ViewModel)
    })

    test('component: () => Promise<{ template, viewModel }>', async () => {
      ko.components.register = jest.fn()

      class ViewModel {}
      const template = 'Hello, World!'
      const getComponent = () =>
        Promise.resolve({
          // intended for use with import('./component')
          template,
          viewModel: ViewModel
        })
      const route = new Route('/', { component: getComponent })
      const ctx = { queue: jest.fn() as any, route } as Context & IContext
      const [middleware] = route.middleware
      const lifecycle = middleware(ctx) as Lifecycle

      if (lifecycle.beforeRender) lifecycle.beforeRender()

      if (lifecycle.beforeRender) lifecycle.beforeRender()

      await ctx.component

      const [registeredComponentName, registeredComponent] = (ko.components
        .register as jest.Mock).mock.calls[0]
      expect(route.component).toMatch(/__router_view_\d+__/)
      expect(registeredComponentName).toMatch(/__router_view_\d+__/)
      expect(registeredComponent.template).toBe(template)
      expect(registeredComponent.synchronous).toBe(true)
      expect(registeredComponent.viewModel.instance).toBeInstanceOf(ViewModel)
    })

    test('specifying component name', async () => {
      ko.components.register = jest.fn()

      class ViewModel {}
      const template = 'Hello, World!'
      const component = {
        template,
        viewModel: ViewModel,
        name: 'my-awesome-component'
      }
      const route = new Route('/', { component })
      const ctx = createMockContext(route)
      const [middleware] = route.middleware
      const lifecycle = middleware(ctx) as Lifecycle

      if (lifecycle.beforeRender) lifecycle.beforeRender()

      await resolveQueue(ctx)

      expect(ko.components.register).toBeCalled()

      const [registeredComponentName] = (ko.components
        .register as jest.Mock).mock.calls[0]
      expect(route.component).toBe('my-awesome-component')
      expect(registeredComponentName).toBe('my-awesome-component')
    })

    test('ctx.component.viewModel is viewModel instance', async () => {
      ko.components.register = jest.fn()

      class ViewModel {
        public itsMe = true
      }
      const template = 'Hello, World!'
      const component = { template, viewModel: ViewModel }
      const route = new Route('/', { component })
      const ctx = createMockContext(route)
      const [middleware] = route.middleware
      const lifecycle = middleware(ctx) as Lifecycle

      if (lifecycle.beforeRender) lifecycle.beforeRender()
      await resolveQueue(ctx)

      expect((ctx.component as IRoutedComponentInstance).viewModel.itsMe).toBe(
        true
      )
    })

    test('disposes component registration after render', async () => {
      ko.components.unregister = jest.fn()

      class ViewModel {}
      const template = 'Hello, World!'
      const component = { template, viewModel: ViewModel }
      const route = new Route('/', { component })
      const ctx = createMockContext(route)
      const [middleware] = route.middleware
      const lifecycle = middleware(ctx) as Lifecycle

      if (lifecycle.beforeRender) lifecycle.beforeRender()
      await resolveQueue(ctx)
      if (lifecycle.afterRender) lifecycle.afterRender()

      expect(ko.components.unregister).lastCalledWith(
        (ctx.component as IRoutedComponentInstance).name
      )
    })

    test('patches viewModel dispose to run beforeDispose', async () => {
      const dispose = jest.fn()

      class ViewModel {
        public dispose = dispose
      }

      const template = 'Hello, World!'
      const component = { template, viewModel: ViewModel }
      const route = new Route('/', { component })
      const queue = jest.fn()
      const ctx = { queue: queue as any, route } as any

      const lifecycles = route.middleware.map((m) => m(ctx)) as Lifecycle[]

      for (const lifecycle of lifecycles) {
        if (lifecycle && lifecycle.beforeRender) lifecycle.beforeRender()
      }
      await Promise.all(queue.mock.calls.map(([p]) => p))

      for (const lifecycle of lifecycles) {
        if (lifecycle && lifecycle.afterRender) lifecycle.afterRender()
      }

      expect(dispose).not.toBeCalled()

      for (const lifecycle of lifecycles) {
        if (lifecycle && lifecycle.beforeDispose) lifecycle.beforeDispose()
      }

      expect(dispose).toHaveBeenCalledTimes(1)
      ctx.component.viewModel.dispose()
      expect(dispose).toHaveBeenCalledTimes(1)
    })

    test("doesn't die if view model doesn't have dispose function", async () => {
      class ViewModel {}

      const template = 'Hello, World!'
      const component = { template, viewModel: ViewModel }
      const route = new Route('/', { component })
      const queue = jest.fn()
      const ctx = { queue: queue as any, route } as any

      for (const middleware of route.middleware) {
        const lifecycle = middleware(ctx) as Lifecycle
        if (lifecycle && lifecycle.beforeRender) lifecycle.beforeRender()
      }
      await Promise.all(queue.mock.calls.map(([p]) => p))

      for (const middleware of route.middleware) {
        const lifecycle = middleware(ctx) as Lifecycle
        if (lifecycle && lifecycle.afterRender) lifecycle.afterRender()
      }

      expect(() => {
        for (const middleware of route.middleware) {
          const lifecycle = middleware(ctx) as Lifecycle
          if (lifecycle && lifecycle.beforeDispose) lifecycle.beforeDispose()
        }
      }).not.toThrow()
    })

    test("doesn't die if component doesn't have viewModel", async () => {
      const template = 'Hello, World!'
      const component = { template }
      const route = new Route('/', { component })
      const queue = jest.fn()
      const ctx = { queue: queue as any, route } as any

      for (const middleware of route.middleware) {
        const lifecycle = middleware(ctx) as Lifecycle
        if (lifecycle && lifecycle.beforeRender) lifecycle.beforeRender()
      }
      await Promise.all(queue.mock.calls.map(([p]) => p))

      for (const middleware of route.middleware) {
        const lifecycle = middleware(ctx) as Lifecycle
        if (lifecycle && lifecycle.afterRender) lifecycle.afterRender()
      }

      expect(() => {
        for (const middleware of route.middleware) {
          const lifecycle = middleware(ctx) as Lifecycle
          if (lifecycle && lifecycle.beforeDispose) lifecycle.beforeDispose()
        }
      }).not.toThrow()
    })
  })

  describe('named components', () => {
    test('sync', async () => {
      const name = 'my-component-1'
      const route = new Route('/', { component: 'my-component-1' })
      const ctx = createMockContext(route)
      const [middleware] = route.middleware
      const lifecycle = middleware(ctx) as Lifecycle

      if (lifecycle.beforeRender) lifecycle.beforeRender()
      await resolveQueue(ctx)

      expect(route.component).toBe(name)
      expect((ctx.component as IRoutedComponentInstance).name).toBe(name)
    })

    test('sync accessor', async () => {
      const name = 'my-component-2'
      const route = new Route('/', {
        component: (_ctx) => {
          expect(_ctx).toEqual(ctx)
          return name
        }
      })
      const ctx = createMockContext(route)
      const [middleware] = route.middleware
      const lifecycle = middleware(ctx) as Lifecycle

      if (lifecycle.beforeRender) lifecycle.beforeRender()
      await resolveQueue(ctx)

      expect(route.component).toBe(name)
    })

    test('async accessor', async () => {
      const name = 'my-component-3'
      const route = new Route('/', {
        component: (_ctx) => {
          expect(_ctx).toEqual(ctx)
          return Promise.resolve(name)
        }
      })
      const ctx = createMockContext(route)
      const [middleware] = route.middleware
      const lifecycle = middleware(ctx) as Lifecycle

      if (lifecycle.beforeRender) lifecycle.beforeRender()
      await resolveQueue(ctx)

      expect(route.component).toBe(name)
      expect((ctx.component as IRoutedComponentInstance).name).toBe(name)
    })
  })

  test('does not dispose component registration', async () => {
    const name = 'my-component-4'
    const route = new Route('/', { component: name })
    const ctx = createMockContext(route)
    const [middleware] = route.middleware
    const lifecycle = middleware(ctx) as Lifecycle

    ko.components.register(name, { template: 'Hello, World! ' })

    if (lifecycle.beforeRender) lifecycle.beforeRender()
    await resolveQueue(ctx)

    if (lifecycle.afterRender) lifecycle.afterRender()

    expect(ko.components.isRegistered('my-component-4')).toBeTruthy()
  })

  test("doesn't blow up when not used", () => {
    const routeConfig: IRouteConfig = {}
    const middleware = componentRoutePlugin(routeConfig)
    expect(middleware).toBeUndefined()
  })
})

function createMockContext(route: Route) {
  return { route, queue: jest.fn() as any } as Context & IContext
}

function resolveQueue(ctx: Context) {
  const queue = ctx.queue as jest.Mock
  return Promise.all(queue.mock.calls.map(([p]) => p))
}
