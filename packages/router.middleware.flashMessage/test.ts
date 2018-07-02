import { Context, IContext } from '@profiscience/knockout-contrib-router'
import {
  IFlashMessage,
  FLASH_MESSAGE,
  flashMessageMiddleware,
  flashMessage
} from './index'

declare module './index' {
  // tslint:disable-next-line no-shadowed-variable
  interface IFlashMessage {
    text: string
  }
}

describe('router.middleware.flashMessage', () => {
  test('sets flashMessage after render', () => {
    const expected = 'This is a flash message'
    const ctx: Context & IContext = { [FLASH_MESSAGE]: expected } as Context &
      IContext
    const lifecycle = flashMessageMiddleware(ctx) as any

    expect(lifecycle.beforeRender).toBeUndefined()
    expect(flashMessage()).toBe(false)

    lifecycle.afterRender()
    expect(flashMessage()).toBe(expected)

    expect(lifecycle.beforeDispose).toBeUndefined()
    expect(flashMessage()).toBe(expected)

    lifecycle.afterDispose()
    expect(flashMessage()).toBe(false)
  })

  test('works with custom flash message format', () => {
    const expected: IFlashMessage = { text: 'This is a flash message' }
    const ctx: Context & IContext = { [FLASH_MESSAGE]: expected } as Context &
      IContext
    const lifecycle = flashMessageMiddleware(ctx) as any

    lifecycle.afterRender()
    expect(flashMessage()).toEqual(expected)

    lifecycle.afterDispose()
    expect(flashMessage()).toBe(false)
  })

  test("doesn't blow up when not used", () => {
    const ctx = {} as Context & IContext
    const lifecycle = flashMessageMiddleware(ctx) as any

    expect(() => {
      lifecycle.afterRender()
      lifecycle.afterDispose()
    }).not.toThrow()
  })
})
