import { Context } from '@profiscience/knockout-contrib-router'

import { createTitleMiddleware } from './title'

describe('title', () => {
  test('sets the title after render and reverts after dispose', () => {
    document.title = 'start'

    const ctx = {} as Context
    const middleware = createTitleMiddleware('foo')
    const lifecycle = middleware(ctx)

    lifecycle.next()
    lifecycle.next()
    expect(document.title).toBe('foo')
    lifecycle.next()
    lifecycle.next()
    expect(document.title).toBe('start')
  })

  test('title works with synchronous getter function', () => {
    document.title = 'start'

    const ctx = {} as Context
    const middleware = createTitleMiddleware(() => 'foo')
    const lifecycle = middleware(ctx)

    lifecycle.next()
    lifecycle.next()
    expect(document.title).toBe('foo')
    lifecycle.next()
    lifecycle.next()
    expect(document.title).toBe('start')
  })

  test('title works with asynchronous getter function', async () => {
    document.title = 'start'

    const middleware = createTitleMiddleware(async () => 'foo')
    let ctx: Context
    let lifecycle: any

    const queue = new Promise((resolve) => {
      ctx = {
        queue: (p: Promise<void>) => resolve()
      } as Context
      lifecycle = middleware(ctx)
    })

    lifecycle.next()
    lifecycle.next()
    await queue
    expect(document.title).toBe('foo')
    lifecycle.next()
    lifecycle.next()
    expect(document.title).toBe('start')
  })
})
