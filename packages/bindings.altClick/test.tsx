import { h } from 'jsx-dom'
import * as ko from 'knockout'

import './index'

const clickEvent = new Event('click')
const altClickEvent = new Event('click')

{ (altClickEvent as any).altKey = true }

describe('bindings.altClick', () => {
  test('calls handler only when alt depressed', () => {
    const actualEl = <div data-bind='altClick: handler'></div>
    const handler = jest.fn()
    ko.applyBindings({ handler }, actualEl)

    actualEl.dispatchEvent(clickEvent)
    actualEl.dispatchEvent(altClickEvent)

    expect(handler).not.toBeCalledWith(undefined, clickEvent)
    expect(handler).toBeCalledWith(undefined, altClickEvent)
  })
})
