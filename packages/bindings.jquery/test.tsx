import { h } from 'jsx-dom'
import * as ko from 'knockout'
import * as $ from 'jquery'

import './index'

describe('bindings.jquery', () => {
  test('calls the jquery plugin on the bound element', (done) => {
    const actualEl = <div data-bind='jquery.myPlugin: {}'></div>
    
    $.fn.myPlugin = function() {
      expect(this.get(0)).toEqual(actualEl)
      done()
    }

    ko.applyBindings({}, actualEl)
  })

  test('calls the jquery plugin with the correct options', (done) => {
    const opts = { myOpts: true }
    const el = <div data-bind='jquery.myPlugin: opts'></div>
    
    $.fn.myPlugin = function(_opts) {
      expect(_opts).toEqual(opts)
      done()
    }

    ko.applyBindings({ opts }, el)
  })
})