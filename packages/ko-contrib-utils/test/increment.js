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
