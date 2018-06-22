import { h } from 'jsx-dom'
import * as ko from 'knockout'

import { metaClickBindingHandler } from './index'

ko.bindingHandlers['click.meta'] = metaClickBindingHandler

const clickEvent = new Event('click')
const metaClickEvent = new Event('click')

{
  ;(metaClickEvent as any).metaKey = true
}

describe('bindings.metaClick', () => {
  test('calls handler only when meta depressed', () => {
    const actualEl = <div data-bind="click.meta: handler" />
    const handler = jest.fn()
    const context = { handler }
    ko.applyBindings(context, actualEl)

    actualEl.dispatchEvent(clickEvent)
    expect(handler).not.toBeCalled()

    actualEl.dispatchEvent(metaClickEvent)
    expect(handler).toBeCalledWith(context, metaClickEvent)
  })
})
