import test from 'ava'
import ko from 'knockout'
import '../src/toString'

test('should return the type and value', (t) => {
  const observable = ko.observable(null)
  const observableArray = ko.observableArray([null])
  const computed = ko.computed(() => null)
  const pureComputed = ko.pureComputed(() => null)

  t.is(observable.toString(), 'Observable(null)')
  t.is(observableArray.toString(), 'ObservableArray([null])')
  t.is(computed.toString(), 'Computed(null)')
  t.is(pureComputed.toString(), 'Computed(null)')
})
