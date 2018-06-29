import { Context, IContext, Route } from '@profiscience/knockout-contrib-router'
import { withRoutePlugin } from './index'

const FOO = Symbol('foo')

declare module '@profiscience/knockout-contrib-router' {
  // tslint:disable-next-line no-shadowed-variable
  interface IContext {
    foo?: string
    [FOO]?: string
  }
}

Route.usePlugin(withRoutePlugin)

describe('router.plugins.with', () => {
  test('extends context with object passed to with', () => {
    const route = new Route('/', { with: { foo: 'bar' } })
    const ctx = { route } as Context & IContext
    const [middleware] = route.middleware

    middleware(ctx)

    expect(ctx.foo).toBe('bar')
  })

  test('works with sync accessor', async () => {
    const route = new Route('/', { with: () => ({ foo: 'bar' }) })
    const ctx = { route } as Context & IContext
    const [middleware] = route.middleware

    await middleware(ctx)

    expect(ctx.foo).toBe('bar')
  })

  test('works with async accessor', async () => {
    const route = new Route('/', {
      with: () => Promise.resolve({ foo: 'bar' })
    })
    const ctx = { route } as Context & IContext
    const [middleware] = route.middleware

    await middleware(ctx)

    expect(ctx.foo).toBe('bar')
  })

  test('accessor recieves context as argument', async () => {
    const accessor = jest.fn(() => ({ foo: 'bar' }))
    const route = new Route('/', { with: accessor })
    const ctx = { route } as Context & IContext
    const [middleware] = route.middleware

    await middleware(ctx)

    expect(accessor).toBeCalledWith(ctx)
  })

  test('works with symbol keys', () => {
    const route = new Route('/', { with: { [FOO]: 'bar' } })
    const ctx = { route } as Context & IContext
    const [middleware] = route.middleware

    middleware(ctx)

    expect((ctx as any)[FOO]).toBe('bar')
  })

  test("doesn't blow up when not used", () => {
    const middleware = withRoutePlugin({})
    expect(middleware).toBeUndefined()
  })
})
