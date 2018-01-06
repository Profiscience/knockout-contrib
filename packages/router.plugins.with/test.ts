import { Context, IContext, IRouteConfig } from '@profiscience/knockout-contrib-router'
import { withPlugin } from './'

declare module '@profiscience/knockout-contrib-router' {
  // tslint:disable-next-line no-shadowed-variable
  interface IContext {
    foo?: string
  }
}

describe('router.plugins.with', () => {
  test('extends context with object passed to with', () => {
    const routeConfig: IRouteConfig = { with: { foo: 'bar' } }
    const ctx = {} as Context & IContext
    const middleware = withPlugin(routeConfig)

    middleware(ctx)

    expect(ctx.foo).toBe('bar')
  })

  test('works with symbol keys', () => {
    const FOO = Symbol('foo')
    const routeConfig: IRouteConfig = { with: { [FOO]: 'bar' } }
    const ctx = {} as Context
    const middleware = withPlugin(routeConfig)

    middleware(ctx)

    expect((ctx as any)[FOO]).toBe('bar')
  })
})
