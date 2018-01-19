import { h } from 'jsx-dom'
import * as ko from 'knockout'

import './index'

const clickEvent = new Event('click')
const shiftClickEvent = new Event('click')

{ (shiftClickEvent as any).shiftKey = true }

describe('bindings.shiftClick', () => {
  test('calls handler only when shift depressed', () => {
    const actualEl = <div data-bind='ctrlClick: handler'></div>
    const handler = jest.fn()
    ko.applyBindings({ handler }, actualEl)

    actualEl.dispatchEvent(clickEvent)
    actualEl.dispatchEvent(shiftClickEvent)

    expect(handler).not.toBeCalledWith(undefined, clickEvent)
    expect(handler).toBeCalledWith(undefined, shiftClickEvent)
  })
})
