import test from 'ava'
import ko from 'knockout'
import merge from '../src/merge'

test('should create a deep observable tree', (t) => {
  const actual = {
    existingUntouched: 'old',
    existingNonObservable: 'old',
    existingObservable: ko.observable('old'),
    existingObject: {
      existingUntouched: 'old',
      existingNonObservable: 'old'
    }
  }

  merge(actual, {
    existingNonObservable: 'new',
    existingObservable: 'new',
    existingObject: {
      existingNonObservable: 'new',
      newProperty: 'new',
      newObject: {
        foo: 'foo'
      }
    },
    newProperty: 'new'
  })

  t.false(ko.isObservable(actual.existingNonObservable))
  t.true(ko.isObservable(actual.existingObservable))
  t.false(ko.isObservable(actual.existingObject.existingNonObservable))
  t.true(ko.isObservable(actual.existingObject.newProperty))
  t.true(ko.isObservable(actual.existingObject.newObject.foo))
  t.true(ko.isObservable(actual.newProperty))


  t.deepEqual(ko.toJS(actual), {
    existingUntouched: 'old',
    existingNonObservable: 'new',
    existingObservable: 'new',
    existingObject: {
      existingUntouched: 'old',
      existingNonObservable: 'new',
      newProperty: 'new',
      newObject: {
        foo: 'foo'
      }
    },
    newProperty: 'new'
  })
})

test('should do nothing when merging identical values', (t) => {
  const actual = { foo: ko.observable('foo') }
  merge(actual, { foo: 'foo' })
  t.true(ko.isObservable(actual.foo))
  t.deepEqual(ko.toJS(actual), { foo: 'foo' })
})

test('should unset explicitly undefined properties', (t) => {
  const actual = { foo: 'foo' }
  merge(actual, { foo: undefined })
  t.false(ko.isObservable(actual.foo))
  t.deepEqual(ko.toJS(actual), { foo: undefined })
})

const testArrays = (mapArraysArg, shouldMapArrays) => (t) => {
  _test({})
  _test({ foo: ko.observableArray([]) })

  function _test(actual) {
    merge(actual, {
      foo: ['foo']
    }, mapArraysArg)

    t.true(ko.isObservable(actual.foo))
    t[shouldMapArrays ? 'true' : 'false'](ko.isObservable(actual.foo()[0]))
    t.is(ko.toJS(actual.foo()[0]), 'foo')
  }
}

test('should create/set shallow arrays when 3rd arg is undefined', testArrays())
test('should create/set shallow arrays when 3rd arg is falsy', testArrays(null))
test('should create/set deep arrays when 3rd arg is true', testArrays(true, true))
