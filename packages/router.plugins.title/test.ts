import {
  Context,
  IContext,
  Lifecycle,
  Route
} from '@profiscience/knockout-contrib-router'

import { createTitleRoutePlugin } from './index'

Route.usePlugin(createTitleRoutePlugin())

async function runQueue(...queues: jest.Mock[]) {
  await Promise.all(
    queues
      .map((q) => q.mock.calls)
      .reduce((accum, cs) => [...accum, ...cs], [])
      .map(([p]) => p)
  )
}

describe('router.plugins.title', () => {
  test('sets the title after render and reverts after dispose', async () => {
    // tslint:disable:no-shadowed-variable
    // ^ This is erroneously being thrown below despite the code blocks

    {
      // page 1
      const queue = jest.fn()
      const ctx = { queue: queue as any } as Context & IContext
      const route = new Route('/', { title: 'foo' })
      const [middleware] = route.middleware
      const lifecycle = middleware(ctx) as Lifecycle

      if (lifecycle.afterRender) lifecycle.afterRender()
      await runQueue(queue)
      expect(document.title).toBe('foo')
      if (lifecycle.beforeDispose) lifecycle.beforeDispose()
    }

    {
      // page 2
      const queue = jest.fn()
      const ctx = { queue: queue as any } as Context & IContext
      const route = new Route('/', { title: 'bar' })
      const [middleware] = route.middleware
      const lifecycle = middleware(ctx) as Lifecycle

      if (lifecycle.afterRender) lifecycle.afterRender()
      await runQueue(queue)
      expect(document.title).toBe('bar')
      if (lifecycle.beforeDispose) lifecycle.beforeDispose()
    }
  })

  test('title works with sync getter function', async () => {
    const queue = jest.fn() as any
    const ctx = { queue } as Context & IContext
    const route = new Route('/', { title: () => 'foo' })
    const [middleware] = route.middleware
    const lifecycle = middleware(ctx) as Lifecycle

    if (lifecycle.afterRender) lifecycle.afterRender()
    await runQueue(queue)
    if (lifecycle.beforeDispose) lifecycle.beforeDispose()
    expect(document.title).toBe('foo')
  })

  test('title works with async getter function', async () => {
    const queue = jest.fn() as any
    const ctx = { queue } as Context & IContext
    const route = new Route('/', { title: () => Promise.resolve('foo') })
    const [middleware] = route.middleware
    const lifecycle = middleware(ctx) as Lifecycle

    if (lifecycle.afterRender) lifecycle.afterRender()
    if (lifecycle.beforeDispose) lifecycle.beforeDispose()

    await runQueue(queue)

    expect(document.title).toBe('foo')
  })

  test('composes nested titles using | by default', async () => {
    const childQueue = jest.fn() as any
    const parentQueue = jest.fn() as any
    const childCtx = { queue: childQueue } as Context & IContext
    const parentCtx = {
      $child: childCtx,
      $children: [childCtx],
      queue: parentQueue
    } as Context & IContext
    const childRoute = new Route('/', { title: 'child' })
    const parentRoute = new Route('/', { title: 'parent' })
    const [childMiddleware] = childRoute.middleware
    const [parentMiddleware] = parentRoute.middleware
    const parentLifecycle = parentMiddleware(parentCtx) as Lifecycle
    const childLifecycle = childMiddleware(childCtx) as Lifecycle

    if (parentLifecycle.afterRender) parentLifecycle.afterRender()
    if (childLifecycle.afterRender) childLifecycle.afterRender()
    await runQueue(childQueue, parentQueue)
    expect(document.title).toBe('parent | child')
    if (childLifecycle.beforeDispose) childLifecycle.beforeDispose()
    if (parentLifecycle.beforeDispose) parentLifecycle.beforeDispose()
  })

  test('composes async getters in the correct order', async () => {
    function createAsyncGetter(v: string, seconds: number) {
      return () =>
        new Promise<string>((resolve) => setTimeout(() => resolve(v), seconds))
    }

    const childQueue = jest.fn()
    const childCtx = {
      queue: childQueue as any
    } as Context & IContext
    const parentQueue = jest.fn()
    const parentCtx = {
      queue: parentQueue as any,
      $child: childCtx,
      $children: [childCtx]
    } as Context & IContext
    const childRoute = new Route('/', {
      title: createAsyncGetter('child', 1000)
    })
    const parentRoute = new Route('/', {
      title: createAsyncGetter('parent', 500)
    })
    const [childMiddleware] = childRoute.middleware
    const [parentMiddleware] = parentRoute.middleware
    const parentLifecycle = parentMiddleware(parentCtx) as Lifecycle
    const childLifecycle = childMiddleware(childCtx) as Lifecycle

    jest.useFakeTimers()

    if (parentLifecycle.afterRender) parentLifecycle.afterRender()
    if (childLifecycle.afterRender) childLifecycle.afterRender()

    jest.runAllTimers()
    await runQueue(childQueue, parentQueue)

    expect(document.title).toBe('parent | child')

    if (childLifecycle.beforeDispose) childLifecycle.beforeDispose()
    if (parentLifecycle.beforeDispose) parentLifecycle.beforeDispose()
  })

  test('composes correctly when async and sync accessor mixed', async () => {
    function createAsyncGetter(v: string, seconds: number) {
      return () =>
        new Promise<string>((resolve) => setTimeout(() => resolve(v), seconds))
    }

    const childQueue = jest.fn()
    const childCtx = {
      queue: childQueue as any
    } as Context & IContext
    const parentQueue = jest.fn()
    const parentCtx = {
      queue: parentQueue as any,
      $child: childCtx,
      $children: [childCtx]
    } as Context & IContext
    const childRoute = new Route('/', {
      title: 'child'
    })
    const parentRoute = new Route('/', {
      title: createAsyncGetter('parent', 500)
    })
    const [childMiddleware] = childRoute.middleware
    const [parentMiddleware] = parentRoute.middleware
    const parentLifecycle = parentMiddleware(parentCtx) as Lifecycle
    const childLifecycle = childMiddleware(childCtx) as Lifecycle

    jest.useFakeTimers()

    if (parentLifecycle.afterRender) parentLifecycle.afterRender()
    if (childLifecycle.afterRender) childLifecycle.afterRender()

    jest.runAllTimers()
    await runQueue(childQueue, parentQueue)

    expect(document.title).toBe('parent | child')

    if (childLifecycle.beforeDispose) childLifecycle.beforeDispose()
    if (parentLifecycle.beforeDispose) parentLifecycle.beforeDispose()
  })

  test('can set custom composer', async () => {
    ;(Route as any).plugins = []

    const customtitleRoutePlugin = createTitleRoutePlugin(
      (ts) => `prefix | ${ts.join(' >> ')} | suffix`
    )

    Route.usePlugin(customtitleRoutePlugin)

    const childQueue = jest.fn() as any
    const parentQueue = jest.fn() as any
    const childCtx = { queue: childQueue } as Context & IContext
    const parentCtx = {
      $child: childCtx,
      $children: [childCtx],
      queue: parentQueue
    } as Context & IContext
    const childRoute = new Route('/', { title: 'child' })
    const parentRoute = new Route('/', { title: 'parent' })
    const [childMiddleware] = childRoute.middleware
    const [parentMiddleware] = parentRoute.middleware

    const parentLifecycle = parentMiddleware(parentCtx) as Lifecycle
    const childLifecycle = childMiddleware(childCtx) as Lifecycle

    if (parentLifecycle.afterRender) parentLifecycle.afterRender()
    if (childLifecycle.afterRender) childLifecycle.afterRender()

    await runQueue(childQueue, parentQueue)

    expect(document.title).toBe('prefix | parent >> child | suffix')

    if (childLifecycle.beforeDispose) childLifecycle.beforeDispose()
    if (parentLifecycle.beforeDispose) parentLifecycle.beforeDispose()
  })

  test("doesn't blow up when not used", () => {
    const middleware = createTitleRoutePlugin()({})
    expect(middleware).toBeUndefined()
  })
})
