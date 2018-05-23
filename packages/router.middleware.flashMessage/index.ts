import * as ko from 'knockout'
import { Context, IContext } from '@profiscience/knockout-contrib-router'

export const FLASH_MESSAGE = Symbol('FLASH_MESSAGE')

// tslint:disable-next-line no-empty-interface
export interface IFlashMessage {}

declare module '@profiscience/knockout-contrib-router' {
  // tslint:disable-next-line no-shadowed-variable
  interface IContext {
    [FLASH_MESSAGE]?: boolean | string | IFlashMessage
  }
}

export const flashMessage: KnockoutObservable<boolean | string | IFlashMessage | undefined> = ko.observable(false)

export function* flashMessageMiddleware(ctx: Context & IContext): IterableIterator<void> {
  /* beforeRender */

  yield
  /* afterRender */
  if (ctx[FLASH_MESSAGE]) {
    flashMessage(ctx[FLASH_MESSAGE])
  }

  yield
  /* beforeDispose */

  yield
  /* afterDispose */
  flashMessage(false)
}
