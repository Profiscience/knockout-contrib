import { Context, IContext, IRouteConfig } from '@profiscience/knockout-contrib-router'
import { withPlugin } from './index'

const FOO = Symbol('foo')

declare module '@profiscience/knockout-contrib-router' {
  // tslint:disable-next-line no-shadowed-variable
  interface IContext {
    foo?: string
    [FOO]?: string
  }
}

describe('router.plugins.with', () => {
  test('extends context with object passed to with', () => {
    const routeConfig: IRouteConfig = { with: { foo: 'bar' } as IContext }
    const ctx = {} as Context & IContext
    const middleware = withPlugin(routeConfig)

    middleware(ctx)

    expect(ctx.foo).toBe('bar')
  })

  test('works with symbol keys', () => {
    const routeConfig: IRouteConfig = { with: { [FOO]: 'bar' } as IContext }
    const ctx = {} as Context & IContext
    const middleware = withPlugin(routeConfig)

    middleware(ctx)

    expect((ctx as any)[FOO]).toBe('bar')
  })

  test('doesn\'t blow up when not used', () => {
    const ctx = {} as Context & IContext
    const routeConfig: IRouteConfig = {}
    const middleware = withPlugin(routeConfig)

    expect(() => middleware(ctx)).not.toThrow()
  })
})
