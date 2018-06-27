import { h } from 'jsx-dom'
import * as ko from 'knockout'

import { shiftClickBindingHandler } from './index'

ko.bindingHandlers['click.shift'] = shiftClickBindingHandler

const clickEvent = new Event('click')
const shiftClickEvent = new Event('click')

{
  ;(shiftClickEvent as any).shiftKey = true
}

describe('bindings.shiftClick', () => {
  test('calls handler only when shift depressed', () => {
    const actualEl = <div data-bind="click.shift: handler" />
    const handler = jest.fn()
    const context = { handler }
    ko.applyBindings(context, actualEl)

    actualEl.dispatchEvent(clickEvent)
    expect(handler).not.toBeCalled()

    actualEl.dispatchEvent(shiftClickEvent)
    expect(handler).toBeCalledWith(context, shiftClickEvent)
  })
})
