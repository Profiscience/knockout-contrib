import * as ko from 'knockout'
import '@profiscience/knockout-contrib-jest-matchers'
import { defaults } from './index'

test('assigns default values', () => {
  const actual = {
    foo: 'foo',
    bar: ko.observable('bar'),
    qux: ko.observable(undefined)
  } as any

  defaults(actual, {
    foo: 'default',
    bar: 'default',
    baz: 'default',
    qux: 'default'
  })

  expect(actual.foo).toBe('foo')
  expect(actual.bar()).toBe('bar')
  expect(actual.baz()).toBe('default')
  expect(actual.qux()).toBe('default')
})

const testArrays = (
  mapArraysArg: undefined | boolean | null,
  shouldMapArrays: boolean
) => () => {
  const actual: any = {}

  defaults(actual, { foo: ['foo'] }, mapArraysArg as boolean)

  expect(actual.foo).toBeObservable()

  shouldMapArrays
    ? expect(actual.foo()[0]).toBeObservable()
    : expect(actual.foo()[0]).not.toBeObservable()

  expect(ko.toJS(actual.foo()[0])).toBe('foo')
}

test(
  'creates shallow arrays when 3rd arg is undefined',
  testArrays(undefined, false)
)
test('creates shallow arrays when 3rd arg is falsy', testArrays(null, false))
test('creates shallow arrays when 3rd arg is false', testArrays(false, false))
test('creates deep arrays when 3rd arg is true', testArrays(true, true))
