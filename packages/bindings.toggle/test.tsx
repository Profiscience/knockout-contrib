import { h } from 'jsx-dom'
import * as ko from 'knockout'

import { toggleBindingHandler } from './index'

ko.bindingHandlers.toggle = toggleBindingHandler

describe('bindings.toggle', () => {
  test('toggles observable', () => {
    const actualEl = <div data-bind="toggle: bool" />
    const bool = ko.observable(true)
    ko.applyBindings({ bool }, actualEl)
    actualEl.click()
    expect(bool()).toBe(false)
  })

  test('throws an error if not observable', () => {
    const actualEl = <div data-bind="toggle: bool" />
    const bool = true
    expect(() => ko.applyBindings({ bool }, actualEl)).toThrow()
  })

  test('can disable toggle with companion toggleDisable binding', () => {
    const actualEl = (
      <div data-bind="toggle: bool, toggleDisable: disableToggle" />
    )
    const bool = ko.observable(true)
    const disableToggle = ko.observable(false)

    ko.applyBindings({ bool, disableToggle }, actualEl)

    actualEl.click()
    expect(bool()).toBe(false)

    disableToggle(true)
    actualEl.click()
    expect(bool()).toBe(false)

    disableToggle(false)
    actualEl.click()
    expect(bool()).toBe(true)
  })
})
