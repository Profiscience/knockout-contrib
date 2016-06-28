import test from 'ava'
import ko from 'knockout'
import '../src/subscribeOnce'

test('should work', (t) => {
  t.plan(4)

  const observable = ko.observable(null)
  const observableArray = ko.observableArray([null])
  const computed = ko.computed(() => observable())
  const pureComputed = ko.pureComputed(() => observable())
  const ok = t.truthy.bind(t)

  observable.subscribeOnce(ok)
  computed.subscribeOnce(ok)
  pureComputed.subscribeOnce(ok)
  observableArray.subscribeOnce(ok)

  observable('foo')
  observableArray(['foo'])

  // the plan would cause these to fail
  observable('bar')
  observableArray.push('bar')
})
