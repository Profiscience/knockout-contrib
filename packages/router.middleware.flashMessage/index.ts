import * as ko from 'knockout'
import { Context, IContext } from '@profiscience/knockout-contrib-router'

export const FLASH_MESSAGE = Symbol('FLASH_MESSAGE')

declare module '@profiscience/knockout-contrib-router' {
  // tslint:disable-next-line no-shadowed-variable
  interface IContext {
    [FLASH_MESSAGE]: string
  }
}

export const flashMessageText = ko.observable('')

export function* flashMessageMiddleware(ctx: Context & IContext) {
  /* beforeRender */

  yield
  /* afterRender */
  if (ctx[FLASH_MESSAGE]) {
    flashMessageText(ctx[FLASH_MESSAGE])
  }

  yield
  /* beforeDispose */

  yield
  /* afterDispose */
  flashMessageText('')
}
