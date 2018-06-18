import * as ko from 'knockout'
import { once } from './index'

test('subscribes once, then disposes', () => {
  expect.assertions(4)

  const observable = ko.observable('')
  const observableArray = ko.observableArray<string>([])
  const computed = ko.computed(() => observable())
  const pureComputed = ko.pureComputed(() => observable())

  const hit = (v: any) => expect(v).toContain('foo')

  once(observable, hit)
  once(computed, hit)
  once(pureComputed, hit)
  once(observableArray, hit)

  observable('foo')
  observableArray(['foo'])

  // expect.assertions(4) would cause these to fail
  observable('bar')
  observableArray.push('bar')
})

test('returns the subscription', (done) => {
  expect.assertions(1)

  const observable = ko.observable('')
  const hit = jest.fn()

  const sub = once(observable, hit)

  sub.dispose()

  observable('foo')

  once(observable, () => {
    expect(hit).not.toBeCalled()
    done()
  })

  observable('bar')
})
