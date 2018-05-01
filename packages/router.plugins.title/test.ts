import { Context, IContext, IRouteConfig, LifecycleGeneratorMiddleware } from '@profiscience/knockout-contrib-router'

import { createTitlePlugin } from './index'

describe('router.plugins.title', () => {
  test('sets the title after render and reverts after dispose', () => {
    const titlePlugin = createTitlePlugin()

    { // page 1
      const ctx = {} as Context & IContext
      const routeConfig: IRouteConfig = { title: 'foo' }
      const middleware = titlePlugin(routeConfig) as LifecycleGeneratorMiddleware
      const lifecycle = middleware(ctx)

      lifecycle.next()
      lifecycle.next()
      expect(document.title).toBe('foo')
      lifecycle.next()
      lifecycle.next()
    }

    { // page 2
      const ctx = {} as Context & IContext
      const routeConfig: IRouteConfig = { title: 'bar' }
      const middleware = titlePlugin(routeConfig) as LifecycleGeneratorMiddleware
      const lifecycle = middleware(ctx)

      lifecycle.next()
      lifecycle.next()
      expect(document.title).toBe('bar')
      lifecycle.next()
      lifecycle.next()
    }
  })

  test('title works with synchronous getter function', () => {
    const ctx = {} as Context & IContext
    const routeConfig: IRouteConfig = { title: () => 'foo' }
    const middleware = createTitlePlugin()(routeConfig) as LifecycleGeneratorMiddleware
    const lifecycle = middleware(ctx)

    lifecycle.next()
    lifecycle.next()
    expect(document.title).toBe('foo')
  })

  test('composes nested titles using | by default', () => {
    const titlePlugin = createTitlePlugin()

    const childCtx = {} as Context & IContext
    const parentCtx = { $child: childCtx, $children: [childCtx] } as Context & IContext
    const childRouteConfig: IRouteConfig = { title: 'child' }
    const parentRouteConfig: IRouteConfig = { title: 'parent' }
    const childMiddleware = titlePlugin(childRouteConfig) as LifecycleGeneratorMiddleware
    const parentMiddleware = titlePlugin(parentRouteConfig) as LifecycleGeneratorMiddleware

    const parentLifecycle = parentMiddleware(parentCtx)
    const childLifecycle = childMiddleware(childCtx)

    parentLifecycle.next()
    childLifecycle.next()
    parentLifecycle.next()
    childLifecycle.next()
    expect(document.title).toBe('parent | child')
    childLifecycle.next()
    parentLifecycle.next()
    childLifecycle.next()
    parentLifecycle.next()
  })

  test('can set custom composer', () => {
    const titlePlugin = createTitlePlugin((ts) => `prefix | ${ts.join(' >> ')} | suffix`)

    const childCtx = {} as Context & IContext
    const parentCtx = { $child: childCtx, $children: [childCtx] } as Context & IContext
    const childRouteConfig: IRouteConfig = { title: 'child' }
    const parentRouteConfig: IRouteConfig = { title: 'parent' }
    const childMiddleware = titlePlugin(childRouteConfig) as LifecycleGeneratorMiddleware
    const parentMiddleware = titlePlugin(parentRouteConfig) as LifecycleGeneratorMiddleware

    const parentLifecycle = parentMiddleware(parentCtx)
    const childLifecycle = childMiddleware(childCtx)

    parentLifecycle.next()
    childLifecycle.next()
    parentLifecycle.next()
    childLifecycle.next()
    expect(document.title).toBe('prefix | parent >> child | suffix')
    childLifecycle.next()
    parentLifecycle.next()
    childLifecycle.next()
    parentLifecycle.next()
  })

  test('doesn\'t blow up when not used', () => {
    const ctx = {} as Context & IContext
    const routeConfig: IRouteConfig = {}
    const middleware = createTitlePlugin()(routeConfig) as LifecycleGeneratorMiddleware
    const lifecycle = middleware(ctx)

    lifecycle.next()
    lifecycle.next()
    lifecycle.next()
    lifecycle.next()

    expect(document.title).toBe('')
  })
})
