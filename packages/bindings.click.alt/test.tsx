import { h } from 'jsx-dom'
import * as ko from 'knockout'

import { altClickBindingHandler } from './index'

ko.bindingHandlers['click.alt'] = altClickBindingHandler

const clickEvent = new Event('click')
const altClickEvent = new Event('click')

{
  ;(altClickEvent as any).altKey = true
}

describe('bindings.altClick', () => {
  test('calls handler only when alt depressed', () => {
    const actualEl = <div data-bind="click.alt: handler" />
    const handler = jest.fn()
    const context = { handler }
    ko.applyBindings(context, actualEl)

    actualEl.dispatchEvent(clickEvent)
    expect(handler).not.toBeCalled()

    actualEl.dispatchEvent(altClickEvent)
    expect(handler).toBeCalledWith(context, altClickEvent)
  })
})
