import { Context, IContext } from '@profiscience/knockout-contrib-router'
import { FLASH_MESSAGE, flashMessageMiddleware, flashMessageText } from './index'

describe('router.middleware.flashMessage', () => {
  test('sets flashMessageText after render', () => {
    const expected = 'This is a flash message'
    const ctx: Context & IContext = { [FLASH_MESSAGE]: expected } as Context & IContext
    const lifecycle = flashMessageMiddleware(ctx)

    lifecycle.next()
    /* beforeRender */
    expect(flashMessageText()).toBe('')

    lifecycle.next()
    /* afterRender */
    expect(flashMessageText()).toBe(expected)

    lifecycle.next()
    /* beforeDispose */
    expect(flashMessageText()).toBe(expected)

    lifecycle.next()
    /* afterDispose */
    expect(flashMessageText()).toBe('')
  })
})
