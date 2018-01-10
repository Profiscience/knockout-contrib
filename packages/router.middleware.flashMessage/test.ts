import { Context, IContext } from '@profiscience/knockout-contrib-router'
import { FLASH_MESSAGE, flashMessageMiddleware, flashMessage } from './index'

describe('router.middleware.flashMessage', () => {
  test('sets flashMessage after render', () => {
    const expected = 'This is a flash message'
    const ctx: Context & IContext = { [FLASH_MESSAGE]: expected } as Context & IContext
    const lifecycle = flashMessageMiddleware(ctx)

    lifecycle.next()
    /* beforeRender */
    expect(flashMessage()).toBe('')

    lifecycle.next()
    /* afterRender */
    expect(flashMessage()).toBe(expected)

    lifecycle.next()
    /* beforeDispose */
    expect(flashMessage()).toBe(expected)

    lifecycle.next()
    /* afterDispose */
    expect(flashMessage()).toBe('')
  })
})
