import { Context, IContext } from '@profiscience/knockout-contrib-router'
import { createLoadingMiddleware } from './index'

describe('router.middleware.middleware', () => {
  test('calls start fn beforeRender at most once', () => {
    const topCtx: Context & IContext = {
      $child: {},
      router: {
        isRoot: true
      }
    } as Context & IContext
    const bottomCtx: Context & IContext = {
      router: {
        isRoot: false
      },
      $child: undefined
    } as any
    const start = jest.fn()
    const middleware = createLoadingMiddleware({
      start,
      end: () => {
        // noop
      }
    })
    const topLifecycle = middleware(topCtx) as any
    const bottomLifecycle = middleware(bottomCtx) as any
    topLifecycle.beforeRender()
    bottomLifecycle.beforeRender()
    expect(start).toHaveBeenCalledTimes(1)
  })
  test('calls send fn afterRender at most once', () => {
    const topCtx: Context & IContext = {
      $child: {},
      router: {
        isRoot: true
      }
    } as Context & IContext
    const bottomCtx: Context & IContext = {
      router: {
        isRoot: false
      },
      $child: undefined
    } as any
    const end = jest.fn()
    const middleware = createLoadingMiddleware({
      start: () => {
        // noop
      },
      end
    })
    const topLifecycle = middleware(topCtx) as any
    const bottomLifecycle = middleware(bottomCtx) as any
    topLifecycle.beforeRender()
    bottomLifecycle.beforeRender()
    topLifecycle.afterRender()
    bottomLifecycle.afterRender()
    expect(end).toHaveBeenCalledTimes(1)
  })
  test('waits to call end until <minDuration> ms have passed', () => {
    jest.useFakeTimers()

    const topCtx: Context & IContext = {
      $child: {},
      router: {
        isRoot: true
      }
    } as Context & IContext
    const bottomCtx: Context & IContext = {
      router: {
        isRoot: false
      },
      $child: undefined
    } as any
    const minDuration = 5000
    const end = jest.fn()
    const middleware = createLoadingMiddleware({
      minDuration,
      start: () => {
        // noop
      },
      end
    })
    const topLifecycle = middleware(topCtx) as any
    const bottomLifecycle = middleware(bottomCtx) as any
    topLifecycle.beforeRender()
    bottomLifecycle.beforeRender()
    topLifecycle.afterRender()
    bottomLifecycle.afterRender()

    expect(end).not.toBeCalled()

    jest.advanceTimersByTime(minDuration)

    expect(end).toHaveBeenCalledTimes(1)
  })
})
