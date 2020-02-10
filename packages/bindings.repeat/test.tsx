import { h } from 'jsx-dom'
import * as ko from 'knockout'

import { repeatBindingHandler } from './index'

ko.bindingHandlers.repeat = repeatBindingHandler

describe('bindings.repeat', () => {
  test('repeats binding element content', () => {
    const actualEl = <div data-bind="repeat: 5">a</div>
    ko.applyBindings({}, actualEl)

    expect(actualEl.innerHTML).toContain('aaaaa')
  })

  test('sets bindingContext.$index', () => {
    const actualEl = (
      <div data-bind="repeat: 3">
        <span data-bind="text: $index"></span>
      </div>
    )
    ko.applyBindings({}, actualEl)

    expect(actualEl.innerHTML).toContain('0')
    expect(actualEl.innerHTML).toContain('1')
    expect(actualEl.innerHTML).toContain('2')
  })
})
