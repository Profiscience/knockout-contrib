import { h } from 'jsx-dom'
import * as ko from 'knockout'
import 'jest-jquery-matchers' // type defs
jest.addMatchers(require('jest-jquery-matchers')) // tslint:disable-line no-var-requires
import { MarkedOptions } from 'marked'

import componentConfig from './index'

ko.components.register('markdown', componentConfig)

describe('components.markdown', () => {
  test('renders markdown', () => {
    const el = <div data-bind='component: { name: "markdown", params: params }'></div>
    const content = '**foo**'
    const params = { content }
    ko.applyBindings({ params }, el)
    expect(el).toHaveDescendantWithText('strong', 'foo')
  })

  test('reacts to changes', () => {
    const el = <div data-bind='component: { name: "markdown", params: params }'></div>
    const content = ko.observable('**foo**')
    const params = { content }
    ko.applyBindings({ params }, el)
    content('_bar_')
    expect(el).toHaveDescendantWithText('em', 'bar')
  })

  test('uses options', (done) => {
    const el = <div data-bind='component: { name: "markdown", params: params }'></div>
    const content = '```js\nsome code\n```'
    const options = {
      highlight(code, lang, cb) {
        cb(null, '')
        done()
      }
    } as MarkedOptions
    ko.applyBindings({ params: { content, options } }, el)
  })

  test('sync highlighter works', () => {
    const el = <div data-bind='component: { name: "markdown", params: params }'></div>
    const content = '```js\nsome code\n```'
    const options = {
      highlight: () => 'some highlighted code'
    } as MarkedOptions
    ko.applyBindings({ params: { content, options } }, el)
    expect(el).toHaveDescendantWithText('code', 'some highlighted code')
  })
})
