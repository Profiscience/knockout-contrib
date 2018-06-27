import * as ko from 'knockout'
import { toggle } from './index'

describe('utils.toggle', () => {
  test('toggles boolean observable', () => {
    const bool = ko.observable(true)
    toggle(bool)
    expect(bool()).toBe(false)
    toggle(bool)
    expect(bool()).toBe(true)
  })

  test('toggles writable computeds', (done) => {
    const bool = ko.pureComputed({
      read: () => true,
      write: (v) => {
        expect(v).toBe(false)
        done()
      }
    })
    toggle(bool)
  })

  test('throws with non writable computeds', () => {
    const bool = ko.pureComputed(() => true)
    expect(() => toggle(bool)).toThrow()
  })

  test('throws with non booleans', () => {
    const num = ko.pureComputed(() => 0)
    expect(() => toggle(num as any)).toThrow()
  })

  test('returns the new value', () => {
    const bool = ko.observable(true)
    expect(toggle(bool)).toBe(false)
  })
})
