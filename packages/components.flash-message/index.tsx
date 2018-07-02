import 'jsx-dom' // type defs
import { h } from 'jsx-dom'
import * as ko from 'knockout'
import { ViewModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-view'
import { flashMessage } from '@profiscience/knockout-contrib-router-middleware-flash-message'

declare module '@profiscience/knockout-contrib-router-middleware-flash-message' {
  // tslint:disable-next-line no-shadowed-variable
  interface IFlashMessage {
    text: string
    type?: string
    timeout?: number
    dismiss?: boolean
  }
}

class FlashMessageViewModel extends ViewModelConstructorBuilder {
  public visible = ko.pureComputed(() => flashMessage() !== false)
  public text = ko.pureComputed(() => {
    const unwrapped = flashMessage()
    return typeof unwrapped === 'undefined' ||
      typeof unwrapped === 'string' ||
      typeof unwrapped === 'boolean'
      ? unwrapped
      : unwrapped.text
  })
  public timeout = ko.pureComputed(() => {
    const unwrapped = flashMessage()
    if (
      typeof unwrapped === 'undefined' ||
      typeof unwrapped === 'string' ||
      typeof unwrapped === 'boolean'
    ) {
      return false
    } else {
      return unwrapped.timeout
    }
  })
  public dismissible = ko.pureComputed(() => {
    const unwrapped = flashMessage()
    return (
      typeof unwrapped !== 'undefined' &&
      typeof unwrapped !== 'string' &&
      typeof unwrapped !== 'boolean' &&
      unwrapped.dismiss
    )
  })
  public css = ko.pureComputed(() => {
    const unwrapped = flashMessage()
    if (
      typeof unwrapped === 'undefined' ||
      typeof unwrapped === 'string' ||
      typeof unwrapped === 'boolean'
    ) {
      return 'alert-info'
    }
    let css =
      typeof unwrapped.type === 'undefined'
        ? ' alert-info'
        : ` alert-${unwrapped.type}`
    if (unwrapped.dismiss) {
      css += ' alert-dismissible'
    }
    return css
  })

  constructor() {
    super()
    this.subscribe(this.timeout, (t) => {
      if (t) {
        setTimeout(() => flashMessage(false), t)
      }
    })
  }

  public dismiss() {
    flashMessage(false)
  }
}

const template = [
  <div role="alert" class="alert" data-bind="visible: visible, css: css">
    <span data-bind="text: text" />
    <button
      type="button"
      class="close"
      data-bind="visible: dismissible, click: dismiss"
      aria-label="Close"
    >
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
]

export const flashMessageComponentConfig: ko.components.Config = {
  synchronous: true,
  viewModel: FlashMessageViewModel,
  template
}
