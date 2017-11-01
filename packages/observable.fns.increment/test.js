import test from 'ava'
import ko from 'knockout'
import '../increment'

test('increment should increment by 1 by default', (t) => {
  const count = ko.observable(0)

  count.increment()
  t.is(count(), 1)
})

test('increment should increment by n', (t) => {
  const count = ko.observable(0)

  count.increment(2)
  t.is(count(), 2)
})

test('increment should work with writable computeds', (t) => {
  t.plan(1)
  const count = ko.pureComputed({ read: () => 0, write: (v) => t.is(v, 1) })
  count.increment()
})

test('increment should throw error with non writable computeds', (t) => {
  const count = ko.pureComputed(() => 0)
  t.throws(count.increment)
})

test('decrement should decrement by 1 by default', (t) => {
  const count = ko.observable(0)

  count.decrement()
  t.is(count(), -1)
})

test('decrement should decrement by n', (t) => {
  const count = ko.observable(0)

  count.decrement(2)
  t.is(count(), -2)
})

test('decrement should work with writable computeds', (t) => {
  t.plan(1)
  const count = ko.pureComputed({ read: () => 0, write: (v) => t.is(v, -1) })
  count.decrement()
})

test('decrement should throw error with non writable computeds', (t) => {
  const count = ko.pureComputed(() => 0)
  t.throws(count.decrement)
})
