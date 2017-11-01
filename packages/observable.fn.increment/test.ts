import * as ko from 'knockout'
import 'jest'
import './'

test('increment by 1 by default', () => {
  const count = ko.observable(0)
  count.increment()
  expect(count()).toBe(1)
})

test('increment by n', () => {
  const count = ko.observable(0)
  count.increment(2)
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
  count.increment()
})

test('increment throws with non writable computeds', () => {
  const count = ko.pureComputed(() => 0)
  expect(count.increment).toThrow()
})

test('decrement by 1 by default', () => {
  const count = ko.observable(0)
  count.decrement()
  expect(count()).toBe(-1)
})

test('decrement by n', () => {
  const count = ko.observable(0)
  count.decrement(2)
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
  count.decrement()
})

test('decrement throws with non writable computeds', () => {
  const count = ko.pureComputed(() => 0)
  expect(count.decrement).toThrow()
})
