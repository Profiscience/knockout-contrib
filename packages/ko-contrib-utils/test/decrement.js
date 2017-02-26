import test from 'ava'
import ko from 'knockout'
import '../src/decrement'

test('should decrement by 1 by default', (t) => {
  const count = ko.observable(0)

  count.decrement()
  t.is(count(), -1)
})

test('should decrement by n', (t) => {
  const count = ko.observable(0)

  count.decrement(2)
  t.is(count(), -2)
})

test('should work with writable computeds', (t) => {
  t.plan(1)
  const count = ko.pureComputed({ read: () => 0, write: (v) => t.is(v, -1) })
  count.decrement()
})

test('should throw error with non writable computeds', (t) => {
  const count = ko.pureComputed(() => 0)
  t.throws(count.decrement)
})
