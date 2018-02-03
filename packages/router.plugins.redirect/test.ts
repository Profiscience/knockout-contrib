import * as ko from 'knockout'
import { Context, IContext, Route, IRouteConfig } from '@profiscience/knockout-contrib-router'

import { redirectPlugin } from './index'

describe('router.plugins.redirect', () => {
  test('calls ctx.redirect if function returns string', async () => {
    const ctx = { redirect: jest.fn() as any } as Context & IContext
    const routeConfig: IRouteConfig = {
      redirect() {
        return '//'
      }
    }
    const middleware = redirectPlugin(routeConfig)
    await middleware(ctx)
    expect(ctx.redirect).lastCalledWith('//')
  })

  test('does not call ctx.redirect if void', async () => {
    const ctx = { redirect: jest.fn() as any } as Context & IContext
    const routeConfig: IRouteConfig = {
      redirect() {
        return
      }
    }
    const middleware = redirectPlugin(routeConfig)
    await middleware(ctx)
    expect(ctx.redirect).not.toBeCalled()
  })

  test('calls ctx.redirect if function return Promise<string>', async () => {
    const ctx = { redirect: jest.fn() as any } as Context & IContext
    const routeConfig: IRouteConfig = {
      redirect() {
        return Promise.resolve('//')
      }
    }
    const middleware = redirectPlugin(routeConfig)
    await middleware(ctx)
    expect(ctx.redirect).lastCalledWith('//')
  })

  test('does not call ctx.redirect if function return Promise<void>', async () => {
    const ctx = { redirect: jest.fn() as any } as Context & IContext
    const routeConfig: IRouteConfig = {
      redirect() {
        return Promise.resolve()
      }
    }
    const middleware = redirectPlugin(routeConfig)
    await middleware(ctx)
    expect(ctx.redirect).not.toBeCalled()
  })

  test('calls fn with ctx', (done) => {
    const ctx = { redirect: jest.fn() as any } as Context & IContext
    const routeConfig: IRouteConfig = {
      redirect(actual) {
        expect(actual).toEqual(ctx)
        done()
      }
    }
    const middleware = redirectPlugin(routeConfig)
    middleware(ctx)
  })

  test('doesn\'t blow up if not used', async () => {
    const ctx = { redirect: jest.fn() as any } as Context & IContext
    const routeConfig: IRouteConfig = {}
    const middleware = redirectPlugin(routeConfig)
    await expect(middleware(ctx)).resolves.toBeUndefined()
  })
})
