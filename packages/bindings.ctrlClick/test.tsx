import { h } from 'jsx-dom'
import * as ko from 'knockout'

import './index'

const clickEvent = new Event('click')
const ctrlClickEvent = new Event('click')

{ (ctrlClickEvent as any).ctrlKey = true }

describe('bindings.ctrlClick', () => {
  test('calls handler only when ctrl depressed', () => {
    const actualEl = <div data-bind='ctrlClick: handler'></div>
    const handler = jest.fn()
    ko.applyBindings({ handler }, actualEl)

    actualEl.dispatchEvent(clickEvent)
    actualEl.dispatchEvent(ctrlClickEvent)

    expect(handler).not.toBeCalledWith(undefined, clickEvent)
    expect(handler).toBeCalledWith(undefined, ctrlClickEvent)
  })
})
