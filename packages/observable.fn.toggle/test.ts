import * as ko from 'knockout'
import './index'

describe('observable.fn.toggle', () => {
  test('toggles boolean observable', () => {
    const bool = ko.observable(true)
    bool.toggle()
    expect(bool()).toBe(false)
    bool.toggle()
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
    bool.toggle()
  })

  test('throws with non writable computeds', () => {
    const bool = ko.pureComputed(() => true)
    expect(bool.toggle).toThrow()
  })

  test('throws with non booleans', () => {
    const num = ko.pureComputed(() => 0)
    expect(num.toggle).toThrow()
  })
})
