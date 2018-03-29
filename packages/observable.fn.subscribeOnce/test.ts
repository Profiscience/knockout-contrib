import * as ko from 'knockout'
import './index'

test('subscribes once, then disposes', () => {
  expect.assertions(4)

  const observable = ko.observable('')
  const observableArray = ko.observableArray<string>([])
  const computed = ko.computed(() => observable())
  const pureComputed = ko.pureComputed(() => observable())

  const hit = (v: any) => expect(v).toContain('foo')

  observable.subscribeOnce(hit)
  computed.subscribeOnce(hit)
  pureComputed.subscribeOnce(hit)
  observableArray.subscribeOnce(hit)

  observable('foo')
  observableArray(['foo'])

  // expect.assertions(4) would cause these to fail
  observable('bar')
  observableArray.push('bar')
})
