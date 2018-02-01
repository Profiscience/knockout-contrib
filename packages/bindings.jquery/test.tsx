import { h } from 'jsx-dom'
import * as ko from 'knockout'
import * as $ from 'jquery'

import binding from './index'

ko.bindingHandlers.jquery = binding

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
    // tslint:disable-next-line only-arrow-functions
    $.fn.myPlugin = function(_opts: any) {
      expect(_opts).toEqual(opts)
      done()
    }
    ko.applyBindings({ opts }, el)
  })

  test('options default to empty object', (done) => {
    const el = <div data-bind='jquery.myPlugin'></div>
    // tslint:disable-next-line only-arrow-functions
    $.fn.myPlugin = function(_opts: any) {
      expect(_opts).toEqual({})
      done()
    }
    ko.applyBindings({}, el)
  })

  test('initializes value binding', (done) => {
    const val = ko.observable()
    const opts = { myOpts: true }
    const el = <div data-bind='jquery.myPlugin: opts, value: val'></div>
    // tslint:disable-next-line only-arrow-functions
    $.fn.myPlugin = function(_opts: any) {
      this.val('foobar')
    }
    val.subscribe((v) => {
      expect(v).toBe('foobar')
      done()
    })
    ko.applyBindings({ opts, val }, el)
  })

  test('updates value binding on change', (done) => {
    const val = ko.observable()
    const opts = { myOpts: true }
    const el = <div data-bind='jquery.myPlugin: opts, value: val'></div>
    // tslint:disable-next-line only-arrow-functions
    $.fn.myPlugin = function(_opts: any) {
      val.subscribe((v) => {
        expect(v).toBe('foobar')
        done()
      })
      this.val('foobar')
      this.trigger('change')
    }
    ko.applyBindings({ opts, val }, el)
  })

  test('works with change event binding handler', (done) => {
    const opts = { myOpts: true }
    const el = <div data-bind='jquery.myPlugin: opts, event: { change: onChange }'></div>
    const onChange = (e) => {
      expect(e.target).toBe(el)
      done()
    }
    // tslint:disable-next-line only-arrow-functions
    $.fn.myPlugin = function(_opts: any) {
      this.trigger('change')
    }
    ko.applyBindings({ opts, onChange }, el)
  })

  test('works with namespaced binding syntax change handler', (done) => {
    const opts = { myOpts: true }
    const el = <div data-bind='jquery.myPlugin: opts, event.change: onChange'></div>
    const onChange = (e) => {
      expect(e.target).toBe(el)
      done()
    }
    // tslint:disable-next-line only-arrow-functions
    $.fn.myPlugin = function(_opts: any) {
      this.trigger('change')
    }
    ko.applyBindings({ opts, onChange }, el)
  })
})
