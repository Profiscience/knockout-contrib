import 'jest'

import { Context, IContext, Middleware } from '@profiscience/knockout-contrib-router'
import { titlePlugin } from './titlePlugin'

describe('titlePlugin', () => {
  test('sets the title after render and reverts after dispose', () => {
    document.title = 'start'

    const route = { title: 'page' }
    const ctx = {} as Context & IContext
    const middleware = titlePlugin(route) as Middleware
    const lifecycle = middleware(ctx)

    lifecycle.afterRender()
    expect(document.title).toBe('page')
    lifecycle.afterDispose()
    expect(document.title).toBe('start')
  })

  test('title works with synchronous getter function', () => {
    document.title = 'start'

    const route = { title: () => 'page' }
    const ctx = {} as Context & IContext
    const middleware = titlePlugin(route) as Middleware
    const lifecycle = middleware(ctx)

    lifecycle.afterRender()
    expect(document.title).toBe('page')
    lifecycle.afterDispose()
    expect(document.title).toBe('start')
  })

  test('title works with synchronous getter function', async () => {
    document.title = 'start'
    let ctx: Context & IContext
    let middleware: Middleware
    let lifecycle: any

    const route = { title: async () => 'page' }
    const queue = new Promise((resolve) => {
      ctx = {
        queue: (p: Promise<void>) => resolve()
      } as Context & IContext
      middleware = titlePlugin(route) as Middleware
      lifecycle = middleware(ctx)
    })

    lifecycle.afterRender()
    await queue
    expect(document.title).toBe('page')
    lifecycle.afterDispose()
    expect(document.title).toBe('start')
  })

  test('doesn\'t blow up when no title provided', () => {
    document.title = 'start'

    const route = {}
    const middleware = titlePlugin(route) as Middleware

    expect(middleware).toEqual([])
  })
})
