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
})
