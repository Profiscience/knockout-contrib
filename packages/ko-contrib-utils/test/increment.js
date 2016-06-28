import test from 'ava'
import ko from 'knockout'
import '../src/increment'

test('should increment/decrement by 1 by default', (t) => {
  const count = ko.observable(0)

  count.increment()
  t.is(count(), 1)
  count.decrement()
  t.is(count(), 0)
})

test('should increment/decrement by n', (t) => {
  const count = ko.observable(0)

  count.increment(2)
  t.is(count(), 2)
  count.decrement(2)
  t.is(count(), 0)
})

test('should work with writable computeds', (t) => {
  t.plan(1)
  const count = ko.pureComputed({ read: () => 0, write: (v) => t.is(v, 1) })
  count.increment()
})

test('should throw error with non writable computeds', (t) => {
  const count = ko.pureComputed(() => 0)
  t.throws(count.increment)
})
