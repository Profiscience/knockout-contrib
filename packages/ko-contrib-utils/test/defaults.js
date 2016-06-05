import test from 'ava'
import ko from 'knockout'
import defaults from '../src/defaults'

test('should assign default values', (t) => {
  const actual = {
    foo: 'foo'
  }

  defaults(actual, {
    foo: 'default',
    bar: 'default'
  })

  t.is(actual.foo, 'foo')
  t.is(actual.bar(), 'default')
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
