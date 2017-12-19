import { h } from 'jsx-dom'
import * as ko from 'knockout'

import './index'

describe('bindings.{{camelCase name}}', () => {
  test('@todo', () => {
    const actualEl = <div data-bind='{{camelCase name}}: opts'></div>
    const opts = {}
    ko.applyBindings({ opts }, actualEl)
  })
})
