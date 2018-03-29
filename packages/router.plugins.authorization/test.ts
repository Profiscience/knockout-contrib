import { Context, IContext, IRouteConfig } from '@profiscience/knockout-contrib-router'
import { FLASH_MESSAGE } from '@profiscience/knockout-contrib-router-middleware-flash-message'
import { IAuthorization, createAuthorizationPlugin } from './index'

const currentUser = { isDeveloper: false }

class DeveloperAuthorization implements IAuthorization {
  public notAuthorizedMessage = 'You must be a developer to access this page'
  public isAuthorized(ctx: Context & IContext) {
    return currentUser.isDeveloper
  }
}

describe('router.plugins.authorization', () => {
  test('authorized user can access', async () => {
    currentUser.isDeveloper = true

    const queue = jest.fn()
    const redirect = jest.fn()
    const ctx = {
      queue: queue as (p: any) => void,
      redirect: redirect as (p: string) => void
    } as Context & IContext
    const routeConfig: IRouteConfig = {
      authorize: [
        new DeveloperAuthorization()
      ]
    }
    const plugin = createAuthorizationPlugin()
    const middleware = plugin(routeConfig)

    middleware(ctx)

    await Promise.all(queue.mock.calls)

    expect(redirect).not.toBeCalled()
  })

  test('unauthorized user can not access', async () => {
    currentUser.isDeveloper = false

    const queue = jest.fn()
    const redirect = jest.fn()
    const ctx = {
      queue: queue as (p: any) => void,
      redirect: redirect as (p: string) => void,
      canonicalPath: ''
    } as Context & IContext
    const routeConfig: IRouteConfig = {
      authorize: [
        new DeveloperAuthorization()
      ]
    }
    const plugin = createAuthorizationPlugin()
    const middleware = plugin(routeConfig)

    middleware(ctx)

    await Promise.all(queue.mock.calls)

    expect(redirect).toBeCalled()
  })

  test('admin can always access', async () => {
    currentUser.isDeveloper = false

    const queue = jest.fn()
    const redirect = jest.fn()
    const ctx = {
      queue: queue as (p: any) => void,
      redirect: redirect as (p: string) => void
    } as Context & IContext
    const routeConfig: IRouteConfig = {
      authorize: [
        new DeveloperAuthorization()
      ]
    }
    const plugin = createAuthorizationPlugin({ isAdmin: true })
    const middleware = plugin(routeConfig)

    middleware(ctx)

    await Promise.all(queue.mock.calls)

    expect(redirect).not.toBeCalled()
  })

  test('authorization can have async test function', async () => {
    // tslint:disable-next-line line max-classes-per-file
    class AsyncAuthorization implements IAuthorization {
      public notAuthorizedMessage = 'You are not authorized to view this page'
      public async isAuthorized() {
        return false
      }
    }

    const queue = jest.fn()
    const redirect = jest.fn()
    const ctx = {
      queue: queue as (p: any) => void,
      redirect: redirect as (p: string) => void,
      canonicalPath: ''
    } as Context & IContext
    const routeConfig: IRouteConfig = {
      authorize: [
        new AsyncAuthorization()
      ]
    }
    const plugin = createAuthorizationPlugin()
    const middleware = plugin(routeConfig)

    middleware(ctx)

    await Promise.all(queue.mock.calls)

    expect(redirect).toBeCalled()
  })

  test('redirects to globally registered redirect path if unauthorized and no route path supplied', async () => {
    currentUser.isDeveloper = false

    const queue = jest.fn()
    const redirect = jest.fn()
    const ctx = {
      queue: queue as (p: any) => void,
      redirect: redirect as (p: string) => void
    } as Context & IContext
    const routeConfig: IRouteConfig = {
      authorize: [
        new DeveloperAuthorization()
      ]
    }
    const plugin = createAuthorizationPlugin({ notAuthorizedRedirectPath: '/foo' })
    const middleware = plugin(routeConfig)

    middleware(ctx)

    await Promise.all(queue.mock.calls)

    expect(redirect.mock.calls[0][0]).toBe('/foo')
  })

  test('redirects to route redirect path if unauthorized', async () => {
    currentUser.isDeveloper = false

    const queue = jest.fn()
    const redirect = jest.fn()
    const ctx = {
      queue: queue as (p: any) => void,
      redirect: redirect as (p: string) => void
    } as Context & IContext
    const routeConfig: IRouteConfig = {
      authorize: {
        authorizations: [
          new DeveloperAuthorization()
        ],
        notAuthorizedRedirectPath: '/bar'
      }
    }
    const plugin = createAuthorizationPlugin({ notAuthorizedRedirectPath: '/foo' })
    const middleware = plugin(routeConfig)

    middleware(ctx)

    await Promise.all(queue.mock.calls)

    expect(redirect.mock.calls[0][0]).toBe('/bar')
  })

  test('supports accessor for route redirect path', async () => {
    currentUser.isDeveloper = false

    const queue = jest.fn()
    const redirect = jest.fn()
    const ctx = {
      queue: queue as (p: any) => void,
      redirect: redirect as (p: string) => void
    } as Context & IContext
    const routeConfig: IRouteConfig = {
      authorize: {
        authorizations: [
          new DeveloperAuthorization()
        ],
        notAuthorizedRedirectPath: async () => '/bar'
      }
    }
    const plugin = createAuthorizationPlugin({ notAuthorizedRedirectPath: '/foo' })
    const middleware = plugin(routeConfig)

    middleware(ctx)

    await Promise.all(queue.mock.calls)

    expect(redirect.mock.calls[0][0]).toBe('/bar')
  })

  test('sets the flash message', async () => {
    currentUser.isDeveloper = false

    const queue = jest.fn()
    const redirect = jest.fn()
    const ctx = {
      queue: queue as (p: any) => void,
      redirect: redirect as (p: string) => void
    } as Context & IContext
    const routeConfig: IRouteConfig = {
      authorize: {
        authorizations: [
          new DeveloperAuthorization()
        ],
        notAuthorizedRedirectPath: '/bar'
      }
    }
    const plugin = createAuthorizationPlugin({ notAuthorizedRedirectPath: '/foo' })
    const middleware = plugin(routeConfig)

    middleware(ctx)

    await Promise.all(queue.mock.calls)

    expect(redirect.mock.calls[0][1]).toEqual({
      with: {
        [FLASH_MESSAGE]: 'You must be a developer to access this page'
      }
    })
  })
})
