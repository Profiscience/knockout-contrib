import * as ko from 'knockout'
import { Context, IContext, Route, IRouteConfig } from '@profiscience/knockout-contrib-router'

import { titlePlugin } from './'

describe('router.plugins.title', () => {
  test('sets the title after render and reverts after dispose', () => {
    document.title = 'start'

    const ctx = {} as Context
    const routeConfig: IRouteConfig = { title: 'foo' }
    const middleware = titlePlugin(routeConfig)
    const lifecycle = middleware(ctx) as IterableIterator<void>

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
    const routeConfig: IRouteConfig = { title: () => 'foo' }
    const middleware = titlePlugin(routeConfig)
    const lifecycle = middleware(ctx) as IterableIterator<void>

    lifecycle.next()
    lifecycle.next()
    expect(document.title).toBe('foo')
    lifecycle.next()
    lifecycle.next()
    expect(document.title).toBe('start')
  })
})
