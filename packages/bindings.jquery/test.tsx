import { h } from 'jsx-dom'
import * as ko from 'knockout'
import * as $ from 'jquery'

import { jqueryBindingHandler } from './index'

ko.bindingHandlers.$ = jqueryBindingHandler

declare global {
  // tslint:disable-next-line:interface-name
  interface JQuery<TElement> {
    myPlugin(opts: any): any
  }
}

describe('bindings.jquery', () => {
  test('calls the jquery plugin on the bound element', (done) => {
    const actualEl = <div data-bind="$.myPlugin: {}" />
    $.fn.myPlugin = function() {
      expect(this.get(0)).toEqual(actualEl)
      done()
    }
    ko.applyBindings({}, actualEl)
  })

  test('calls the jquery plugin with the correct options', (done) => {
    const opts = { myOpts: true }
    const el = <div data-bind="$.myPlugin: opts" />
    // tslint:disable-next-line only-arrow-functions
    $.fn.myPlugin = function(_opts: any) {
      expect(_opts).toEqual(opts)
      done()
    }
    ko.applyBindings({ opts }, el)
  })

  test('options default to undefined', (done) => {
    const el = <div data-bind="$.myPlugin" />
    // tslint:disable-next-line only-arrow-functions
    $.fn.myPlugin = function(_opts: any) {
      expect(_opts).toBeUndefined()
      done()
    }
    ko.applyBindings({}, el)
  })

  test('initializes value binding', (done) => {
    const val = ko.observable()
    const opts = { myOpts: true }
    const el = <div data-bind="$.myPlugin: opts, value: val" />
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
    const el = <div data-bind="$.myPlugin: opts, value: val" />
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
    const el = <div data-bind="$.myPlugin: opts, event: { change: onChange }" />
    const onChange = (e: JQuery.Event) => {
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
    const el = <div data-bind="$.myPlugin: opts, event.change: onChange" />
    const onChange = (e: JQuery.Event) => {
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
