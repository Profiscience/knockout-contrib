import test from 'ava'
import ko from 'knockout'
import { defaults } from '../dist/umd'

test('should assign default values', (t) => {
  const actual = {
    foo: 'foo',
    bar: ko.observable('bar'),
    baz: undefined,
    qux: ko.observable(undefined)
  }

  defaults(actual, {
    foo: 'default',
    bar: 'default',
    baz: 'default',
    qux: 'default',
  })

  t.is(actual.foo, 'foo')
  t.is(actual.bar(), 'bar')
  t.is(actual.baz(), 'default')
  t.is(actual.qux(), 'default')
})

const testArrays = (mapArraysArg, shouldMapArrays) => (t) => {
  const actual = {}

  defaults(actual, {
    foo: ['foo']
  }, mapArraysArg)

  t.true(ko.isObservable(actual.foo))
  t[shouldMapArrays ? 'true' : 'false'](ko.isObservable(actual.foo()[0]))
  t.is(ko.toJS(actual.foo()[0]), 'foo')
}

test('should create shallow arrays when 3rd arg is undefined', testArrays())
test('should create shallow arrays when 3rd arg is falsy', testArrays(null))
test('should create deep arrays when 3rd arg is true', testArrays(true, true))
