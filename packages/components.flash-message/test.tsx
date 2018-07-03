import { h } from 'jsx-dom'
import * as ko from 'knockout'
import 'jest-jquery-matchers' // import type defs
import { flashMessage } from '@profiscience/knockout-contrib-router-middleware-flash-message'

import { flashMessageComponentConfig } from './index'

ko.components.register('contrib-flash-message', flashMessageComponentConfig)

jest.addMatchers(require('jest-jquery-matchers')) // tslint:disable-line no-var-requires

let $el: HTMLDivElement

describe('flash-message component', () => {
  beforeAll(() => {
    $el = (
      <div data-bind="component: &quot;contrib-flash-message&quot;" />
    ) as HTMLDivElement
    ko.applyBindings({}, $el)
  })

  test('displays the correct text when flashMessage() is string', () => {
    const v = 'string text'
    flashMessage(v)
    expect($el).toHaveText(v)
  })

  test('displays the correct text with expanded options', () => {
    const v = { text: 'expanded' }
    flashMessage(v)
    expect($el).toHaveText(v.text)
  })

  test('does not display when flashMessage() is false', () => {
    flashMessage(false)
    expect(($el.firstChild as HTMLDivElement).style.display).toBe('none')
  })

  test('default type is info', () => {
    const v = 'foo'
    flashMessage(v)
    expect($el.firstChild).toHaveClass('alert-info')
  })

  test('type specified in options is used with alert-* prefix', () => {
    const v = { text: 'foo', type: 'warning' }
    flashMessage(v)
    expect($el.firstChild).toHaveClass('alert-warning')
  })

  test('shows dismiss button when dismiss is true', () => {
    const v = { text: 'foo', dismiss: true }
    flashMessage(v)
    expect($el.getElementsByTagName('button')[0].style.display).not.toBe('none')
  })

  test('does not show dismiss button when dismiss is undefined', () => {
    const v = { text: 'foo' }
    flashMessage(v)
    expect($el.getElementsByTagName('button')[0].style.display).toBe('none')
  })

  test('does not show dismiss button when dismiss is false', () => {
    const v = { text: 'foo', dismiss: false }
    flashMessage(v)
    expect($el.getElementsByTagName('button')[0].style.display).toBe('none')
  })

  test('can manually dismiss', () => {
    const v = { text: 'foo', dismiss: true }
    flashMessage(v)
    $el.getElementsByTagName('button')[0].click()
    expect(flashMessage()).toBe(false)
  })

  test('hides after timeout', async () => {
    const v = { text: 'foo', timeout: 1000 }
    jest.useFakeTimers()
    flashMessage(v)
    jest.runAllTimers()
    expect(flashMessage()).toBe(false)
  })
})
