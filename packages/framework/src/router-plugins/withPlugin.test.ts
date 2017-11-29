import 'jest'

import { Context, IContext, Middleware } from '@profiscience/knockout-contrib-router'
import { withPlugin } from './withPlugin'

describe('withPlugin', () => {
  test('extends the context with provided object', () => {
    const route = { with: { foo: 'bar' } }
    const ctx = {} as Context & IContext & { foo: string }
    const middleware = withPlugin(route) as Middleware

    middleware(ctx)

    expect(ctx.foo).toBe('bar')
  })

  test('doesn\'t blow up when no with provided', () => {
    const route = {}
    const middleware = withPlugin(route) as Middleware

    expect(middleware).toEqual([])
  })
})
