import { h } from 'jsx-dom'
import * as ko from 'knockout'

import { ctrlClickBindingHandler } from './index'

ko.bindingHandlers['click.ctrl'] = ctrlClickBindingHandler

const clickEvent = new Event('click')
const ctrlClickEvent = new Event('click')

{ (ctrlClickEvent as any).ctrlKey = true }

describe('bindings.ctrlClick', () => {
  test('calls handler only when ctrl depressed', () => {
    const actualEl = <div data-bind='click.ctrl: handler'></div>
    const handler = jest.fn()
    ko.applyBindings({ handler }, actualEl)

    actualEl.dispatchEvent(clickEvent)
    actualEl.dispatchEvent(ctrlClickEvent)

    expect(handler).not.toBeCalledWith(undefined, clickEvent)
    expect(handler).toBeCalledWith(undefined, ctrlClickEvent)
  })
})
