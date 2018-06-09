import { h } from 'jsx-dom'
import * as ko from 'knockout'

import { metaClickBindingHandler } from './index'

ko.bindingHandlers['click.meta'] = metaClickBindingHandler

const clickEvent = new Event('click')
const metaClickEvent = new Event('click')

{ (metaClickEvent as any).metaKey = true }

describe('bindings.metaClick', () => {
  test('calls handler only when meta depressed', () => {
    const actualEl = <div data-bind='click.meta: handler'></div>
    const handler = jest.fn()
    ko.applyBindings({ handler }, actualEl)

    actualEl.dispatchEvent(clickEvent)
    actualEl.dispatchEvent(metaClickEvent)

    expect(handler).not.toBeCalledWith(undefined, clickEvent)
    expect(handler).toBeCalledWith(undefined, metaClickEvent)
  })
})
