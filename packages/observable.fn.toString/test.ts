import * as ko from 'knockout'
import './index'

test('returns the type and value', () => {
  const observable = ko.observable(null)
  const observableArray = ko.observableArray([null])
  const computed = ko.computed(() => null)
  const pureComputed = ko.pureComputed(() => null)

  expect(observable.toString()).toBe('Observable(null)')
  expect(observableArray.toString()).toBe('ObservableArray([null])')
  expect(computed.toString()).toBe('Computed(null)')
  expect(pureComputed.toString()).toBe('Computed(null)')
})
