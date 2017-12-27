import * as ko from 'knockout'

import './index'

describe('{{kebabCase name}} component', () => {
  test('@todo', () => {
    const el = <div data-bind='component: { name: "{{kebabCase name}}", params: params }'></div>
    const params = {}

    ko.applyBindingsToNode(el, { params })
  })
})
