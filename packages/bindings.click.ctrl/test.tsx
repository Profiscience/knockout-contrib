import { h } from 'jsx-dom'
import * as ko from 'knockout'

import { ctrlClickBindingHandler } from './index'

ko.bindingHandlers['click.ctrl'] = ctrlClickBindingHandler

const clickEvent = new Event('click')
const ctrlClickEvent = new Event('click')

{
  ;(ctrlClickEvent as any).ctrlKey = true
}

describe('bindings.ctrlClick', () => {
  test('calls handler only when ctrl depressed', () => {
    const actualEl = <div data-bind="click.ctrl: handler" />
    const handler = jest.fn()
    const context = { handler }
    ko.applyBindings(context, actualEl)

    actualEl.dispatchEvent(clickEvent)
    expect(handler).not.toBeCalled()

    actualEl.dispatchEvent(ctrlClickEvent)
    expect(handler).toBeCalledWith(context, ctrlClickEvent)
  })
})
