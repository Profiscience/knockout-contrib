import { Context, IContext, Route } from '@profiscience/knockout-contrib-router'

import { redirectRoutePlugin } from './index'

Route.usePlugin(redirectRoutePlugin)

describe('router.plugins.redirect', () => {
  test('calls ctx.redirect if function returns string', async () => {
    const ctx = { redirect: jest.fn() as any } as Context & IContext
    const route = new Route('/', {
      redirect() {
        return '//'
      }
    })
    const [middleware] = route.middleware
    await middleware(ctx)
    expect(ctx.redirect).lastCalledWith('//')
  })

  test('does not call ctx.redirect if void', async () => {
    const ctx = { redirect: jest.fn() as any } as Context & IContext
    const route = new Route('/', {
      redirect() {
        return
      }
    })
    const [middleware] = route.middleware
    await middleware(ctx)
    expect(ctx.redirect).not.toBeCalled()
  })

  test('calls ctx.redirect if function return Promise<string>', async () => {
    const ctx = { redirect: jest.fn() as any } as Context & IContext
    const route = new Route('/', {
      redirect() {
        return Promise.resolve('//')
      }
    })
    const [middleware] = route.middleware
    await middleware(ctx)
    expect(ctx.redirect).lastCalledWith('//')
  })

  test('does not call ctx.redirect if function return Promise<void>', async () => {
    const ctx = { redirect: jest.fn() as any } as Context & IContext
    const route = new Route('/', {
      redirect() {
        return Promise.resolve()
      }
    })
    const [middleware] = route.middleware
    await middleware(ctx)
    expect(ctx.redirect).not.toBeCalled()
  })

  test('calls fn with ctx', (done) => {
    const ctx = { redirect: jest.fn() as any } as Context & IContext
    const route = new Route('/', {
      redirect(actual) {
        expect(actual).toEqual(ctx)
        done()
      }
    })
    const [middleware] = route.middleware
    middleware(ctx)
  })

  test("doesn't blow up if not used", async () => {
    const route = new Route('/', {})
    expect(route.middleware.length).toBe(0)
  })
})
