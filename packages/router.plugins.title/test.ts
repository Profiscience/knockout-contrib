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

  test('title works with sync getter function', () => {
    const ctx = {} as Context & IContext
    const routeConfig: IRouteConfig = { title: () => 'foo' }
    const middleware = createTitlePlugin()(routeConfig) as LifecycleGeneratorMiddleware
    const lifecycle = middleware(ctx)

    lifecycle.next()
    lifecycle.next()
    expect(document.title).toBe('foo')
  })

  test('title works with async getter function', async () => {
    const queue = jest.fn()
    const ctx = { queue: queue as any } as Context & IContext
    const routeConfig: IRouteConfig = { title: () => Promise.resolve('foo') }
    const middleware = createTitlePlugin()(routeConfig) as LifecycleGeneratorMiddleware
    const lifecycle = middleware(ctx)

    lifecycle.next()
    lifecycle.next()

    await Promise.all(queue.mock.calls.map(([p]) => p))

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

  test('composes async getters in the correct order', async () => {
    function createAsyncGetter(v: string, seconds: number) {
      return () => new Promise<string>((resolve) => setTimeout(() => resolve(v), seconds))
    }

    const titlePlugin = createTitlePlugin()

    const childCtxQueue = jest.fn()
    const childCtx = {
      queue: childCtxQueue as any
    } as Context & IContext
    const parentCtxQueue = jest.fn()
    const parentCtx = {
      queue: parentCtxQueue as any,
      $child: childCtx,
      $children: [childCtx]
    } as Context & IContext
    const childRouteConfig: IRouteConfig = { title: createAsyncGetter('child', 1000) }
    const parentRouteConfig: IRouteConfig = { title: createAsyncGetter('parent', 500) }
    const childMiddleware = titlePlugin(childRouteConfig) as LifecycleGeneratorMiddleware
    const parentMiddleware = titlePlugin(parentRouteConfig) as LifecycleGeneratorMiddleware

    const parentLifecycle = parentMiddleware(parentCtx)
    const childLifecycle = childMiddleware(childCtx)

    jest.useFakeTimers()

    parentLifecycle.next()
    childLifecycle.next()
    parentLifecycle.next()
    childLifecycle.next()

    jest.runAllTimers()
    await Promise.all([
      ...childCtxQueue.mock.calls,
      ...parentCtxQueue.mock.calls
    ].map(([p]) => p))

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
