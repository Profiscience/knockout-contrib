import * as ko from 'knockout'
import { increment, decrement } from './index'

describe('utils.increment', () => {
  test('increment by 1 by default', () => {
    const count = ko.observable(0)
    increment(count)
    expect(count()).toBe(1)
  })

  test('increment by n', () => {
    const count = ko.observable(0)
    increment(count, 2)
    expect(count()).toBe(2)
  })

  test('increment writable computeds', (done) => {
    const count = ko.pureComputed({
      read: () => 0,
      write: (v) => {
        expect(v).toBe(1)
        done()
      }
    })
    increment(count)
  })

  test('increment throws with non writable computeds', () => {
    const count = ko.pureComputed(() => 0)
    expect(() => increment(count)).toThrow()
  })

  test('returns the new value', () => {
    const count = ko.observable(0)
    const v = increment(count)
    expect(v).toBe(count())
  })
})

describe('utils.decrement', () => {
  test('decrement by 1 by default', () => {
    const count = ko.observable(0)
    decrement(count)
    expect(count()).toBe(-1)
  })

  test('decrement by n', () => {
    const count = ko.observable(0)
    decrement(count, 2)
    expect(count()).toBe(-2)
  })

  test('decrement writable computeds', (done) => {
    const count = ko.pureComputed({
      read: () => 0,
      write: (v) => {
        expect(v).toBe(-1)
        done()
      }
    })
    decrement(count)
  })

  test('decrement throws with non writable computeds', () => {
    const count = ko.pureComputed(() => 0)
    expect(() => decrement(count)).toThrow()
  })

  test('returns the new value', () => {
    const count = ko.observable(0)
    const v = decrement(count)
    expect(v).toBe(count())
  })
})
