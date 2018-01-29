import * as ToProgress from 'toprogress2'
import { Context, IContext } from '@profiscience/knockout-contrib-router'
import { createProgressBarMiddleware } from './index'

beforeEach(() => {
  (ToProgress as any).reset()
})

describe('router.middleware.progressBar', () => {
  test('passes options to toprogress2', () => {
    const ctx: Context & IContext = { router: {} } as Context & IContext
    const opts = { color: '#fff' }
    const lifecycle = createProgressBarMiddleware(opts)(ctx)
    lifecycle.next()
    expect((ToProgress as any).initializedWith()).toBe(opts)
  })
  test('starts progress bar before render at most once', () => {
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
    } as Context & IContext
    const middleware = createProgressBarMiddleware()
    const topLifecycle = middleware(topCtx)
    const bottomLifecycle = middleware(bottomCtx)
    topLifecycle.next()
    bottomLifecycle.next()
    expect((ToProgress as any).start).toHaveBeenCalledTimes(1)
  })
  test('starts progress bar after render at most once', () => {
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
    } as Context & IContext
    const middleware = createProgressBarMiddleware()
    const topLifecycle = middleware(topCtx)
    const bottomLifecycle = middleware(bottomCtx)
    topLifecycle.next()
    bottomLifecycle.next()
    topLifecycle.next()
    bottomLifecycle.next()
    expect((ToProgress as any).finish).toHaveBeenCalledTimes(1)
  })
})
