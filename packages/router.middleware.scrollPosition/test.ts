import { Context, IContext } from '@profiscience/knockout-contrib-router'
import { createScrollPositionMiddleware } from './index'

beforeEach(() => {
  window.scrollTo = jest.fn()
})

describe('router.middleware.scrollPosition', () => {
  test('sets the scroll position to the top after render', () => {
    const ctx: Context & IContext = {} as Context & IContext
    const lifecycle = createScrollPositionMiddleware()(ctx) as {
      beforeRender: any
      afterRender: any
      beforeDispose: any
    }

    expect(window.scrollTo).not.toHaveBeenCalled()

    lifecycle.afterRender()
    expect(window.scrollTo).lastCalledWith(0, 0)
  })

  test('persists the scroll position to history.state before dispose', () => {
    const ctx: Context & IContext = {} as Context & IContext
    const lifecycle = createScrollPositionMiddleware()(ctx) as {
      beforeRender: any
      afterRender: any
      beforeDispose: any
    }

    const _window = window as any

    lifecycle.afterRender()

    _window.scrollY = 500

    lifecycle.beforeDispose()

    expect(history.state.scrollPosition).toBe(500)
  })

  test('restores scroll position from history.state, disregarding hash if any', () => {
    history.replaceState({ scrollPosition: 999 }, document.title, '/#!/#foo')
    const ctx: Context & IContext = {} as Context & IContext
    const lifecycle = createScrollPositionMiddleware()(ctx) as {
      beforeRender: any
      afterRender: any
      beforeDispose: any
    }

    lifecycle.afterRender()

    expect(window.scrollTo).lastCalledWith(0, 999)
  })

  test('scrolls to hash if present and no position in history.state', () => {
    const el = document.createElement('foo')
    el.style.position = 'fixed'
    el.style.top = '50px'
    document.body.appendChild(el)

    history.replaceState({}, document.title, '/#!/#foo')
    document.getElementById = jest.fn(() => el)

    const ctx: Context & IContext = {} as Context & IContext
    const lifecycle = createScrollPositionMiddleware()(ctx) as {
      beforeRender: any
      afterRender: any
      beforeDispose: any
    }

    lifecycle.afterRender()

    expect(document.getElementById).lastCalledWith('foo')
    expect(window.scrollTo).lastCalledWith(0, el.offsetTop)
  })

  test('logs warning if anchor for hash does not exist and scrolls to top', () => {
    history.replaceState({}, document.title, '/#!/#foo')
    document.getElementById = jest.fn(() => null)
    // tslint:disable-next-line:no-console
    console.warn = jest.fn()

    const ctx: Context & IContext = {} as Context & IContext
    const lifecycle = createScrollPositionMiddleware()(ctx) as {
      beforeRender: any
      afterRender: any
      beforeDispose: any
    }

    lifecycle.afterRender()

    // tslint:disable-next-line:no-console
    expect(console.warn).toBeCalled()
  })
})
