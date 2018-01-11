import { Context, IContext } from '@profiscience/knockout-contrib-router'
import { IFlashMessage, FLASH_MESSAGE, flashMessageMiddleware, flashMessage } from './index'

declare module './index' {
  // tslint:disable-next-line no-shadowed-variable
  interface IFlashMessage {
    text: string
  }
}

describe('router.middleware.flashMessage', () => {
  test('sets flashMessage after render', () => {
    const expected = 'This is a flash message'
    const ctx: Context & IContext = { [FLASH_MESSAGE]: expected } as Context & IContext
    const lifecycle = flashMessageMiddleware(ctx)

    lifecycle.next()
    /* beforeRender */
    expect(flashMessage()).toBe(false)

    lifecycle.next()
    /* afterRender */
    expect(flashMessage()).toBe(expected)

    lifecycle.next()
    /* beforeDispose */
    expect(flashMessage()).toBe(expected)

    lifecycle.next()
    /* afterDispose */
    expect(flashMessage()).toBe(false)
  })

  test('works with custom flash message format', () => {
    const expected: IFlashMessage = { text: 'This is a flash message' }
    const ctx: Context & IContext = { [FLASH_MESSAGE]: expected } as Context & IContext
    const lifecycle = flashMessageMiddleware(ctx)

    lifecycle.next()
    /* beforeRender */
    expect(flashMessage()).toBe(false)

    lifecycle.next()
    /* afterRender */
    expect(flashMessage()).toEqual(expected)

    lifecycle.next()
    /* beforeDispose */
    expect(flashMessage()).toEqual(expected)

    lifecycle.next()
    /* afterDispose */
    expect(flashMessage()).toBe(false)
  })

  test('doesn\'t blow up when not used', () => {
    const ctx = {} as Context & IContext
    const lifecycle = flashMessageMiddleware(ctx) as IterableIterator<void>

    expect(() => {
      lifecycle.next()
      lifecycle.next()
      lifecycle.next()
      lifecycle.next()
    }).not.toThrow()
  })
})
