import { h } from 'jsx-dom'
import * as ko from 'knockout'

import './index'

const clickEvent = new Event('click')
const ctrlClickEvent = new Event('click')
const metaClickEvent = new Event('click') // mac

{ (ctrlClickEvent as any).ctrlKey = true }
{ (metaClickEvent as any).metaKey = true }

describe('bindings.ctrlClick', () => {
  test('calls handler only when modifier depressed (ctrl/meta)', () => {
    const actualEl = <div data-bind='ctrlClick: handler'></div>
    const handler = jest.fn()
    ko.applyBindings({ handler }, actualEl)

    actualEl.dispatchEvent(clickEvent)
    actualEl.dispatchEvent(ctrlClickEvent)
    actualEl.dispatchEvent(metaClickEvent)

    expect(handler).not.toBeCalledWith(undefined, clickEvent)
    expect(handler).toBeCalledWith(undefined, ctrlClickEvent)
    expect(handler).toBeCalledWith(undefined, metaClickEvent)
  })

  test('can disable support for meta', () => {
    const actualEl = <div data-bind='ctrlClick: handler, ctrlClickAllowMeta: false'></div>
    const handler = jest.fn()
    ko.applyBindings({ handler }, actualEl)

    actualEl.dispatchEvent(metaClickEvent)
    expect(handler).not.toBeCalledWith(undefined, metaClickEvent)
  })
})
