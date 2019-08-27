import * as ko from 'knockout'
import { LifecycleMiddleware } from '@profiscience/knockout-contrib-router'

export const FLASH_MESSAGE = Symbol('FLASH_MESSAGE')

export interface IFlashMessage {}

declare module '@profiscience/knockout-contrib-router' {
  interface IContext {
    [FLASH_MESSAGE]?: boolean | string | IFlashMessage
  }
}

export const flashMessage: ko.Observable<
  boolean | string | IFlashMessage | undefined
> = ko.observable(false)

export const flashMessageMiddleware: LifecycleMiddleware = (ctx) => ({
  afterRender() {
    if (ctx[FLASH_MESSAGE]) flashMessage(ctx[FLASH_MESSAGE])
  },
  afterDispose() {
    flashMessage(false)
  }
})
