import { h } from 'jsx-dom'
import * as ko from 'knockout'

export type ToastType = 'success' | 'error' | 'info'

export type Toast = {
  text: string
  type: ToastType
  dispose(): void,
  timer?: NodeJS.Timer
}

export default class ToastViewModel {
  private toasts: KnockoutObservableArray<Toast>
  private static toasts = ko.observableArray<Toast>([])

  constructor() {
    this.toasts = new.target.toasts
  }

  private pauseOnHoverHandlers = {
    mouseover: () => {
      this.toasts().forEach((t) => {
        clearTimeout(t.timer)
        t.timer = undefined
      })
    },

    mouseout: () => {
      this.toasts().forEach((t) => {
        t.timer = setTimeout(() => t.dispose(), 5000)
      })
    }
  }

  private animateIn(el: HTMLElement) {
    el.classList.add('toast-enter')
  }

  private animateOut(el: HTMLElement) {
    el.addEventListener('animationend', () => el.remove())
    el.classList.add('toast-exit')
  }

  public static success(text: string): Toast {
    return this.create(text, 'success')
  }

  public static error(text: string): Toast {
    return this.create(text, 'error')
  }
  
  public static info(text: string): Toast {
    return this.create(text, 'info')
  }

  private static create(text: string, type: ToastType) {
    const t: Toast = {
      text,
      type,
      dispose: () => this.toasts.remove(t),
      timer: setTimeout(() => t.dispose(), 5000)
    }
    this.toasts.push(t)
    return t
  }
}

const template = [
  <div class='toast-container' data-bind='foreach: { data: toasts, afterAdd: animateIn, beforeRemove: animateOut }, event: pauseOnHoverHandlers'>
    <div class='toast' data-bind='_toast'>
      <div class='toast-close' data-bind='click: dispose'>&times;</div>
      <span class='toast-text' data-bind='text: text'></span>
    </div>
  </div>
]

ko.bindingHandlers._toast = {
  init(el, valueAccessor, allBindings, viewModel, bindingCtx) {
    ko.applyBindingsToNode(el, {
      css: ko.pureComputed(() =>
        `toast-${bindingCtx.$index()} toast-${bindingCtx.$data.type}`)
    })
  }
}

ko.components.register('knockout-contrib-toast', {
  viewModel: ToastViewModel,
  template
})
