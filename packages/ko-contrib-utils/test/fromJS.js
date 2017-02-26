import test from 'ava'
import ko from 'knockout'
import fromJS from '../src/fromJS'

test('should create a deep observable tree', (t) => {
  const raw = {
    num: 1,
    str: 'str',
    date: new Date(),
    bool: true,
    arr: [],
    regexp: /foo/,
    obj: { foo: 'foo' },
    obs: ko.observable({ foo: 'bar' }),
    func() {}, // eslint-disable-line
    class: new class {
      constructor() {
        this.num = 1
        this.str = 'str'
        this.date = new Date()
        this.bool = true
        this.arr = []
        this.obj = { foo: 'foo' }
        this.obs = ko.observable({ foo: 'bar' })
        this.regexp = /foo/
      }
      func() {} // eslint-disable-line
    }
  }

  const actual = fromJS(raw)

  t.true(ko.isObservable(actual.num))
  t.true(ko.isObservable(actual.str))
  t.true(ko.isObservable(actual.date))
  t.true(ko.isObservable(actual.bool))
  t.true(ko.isObservable(actual.arr))
  t.true(ko.isObservable(actual.regexp))
  t.false(ko.isObservable(actual.obj))
  t.true(ko.isObservable(actual.obj.foo))
  t.true(ko.isObservable(actual.obs))
  t.false(ko.isObservable(actual.obs().foo))
  t.false(ko.isObservable(actual.func))
  t.false(ko.isObservable(actual.class))

  t.true(ko.isObservable(actual.class.num))
  t.true(ko.isObservable(actual.class.str))
  t.true(ko.isObservable(actual.class.date))
  t.true(ko.isObservable(actual.class.bool))
  t.true(ko.isObservable(actual.class.arr))
  t.true(ko.isObservable(actual.class.regexp))
  t.false(ko.isObservable(actual.class.obj))
  t.true(ko.isObservable(actual.class.obj.foo))
  t.true(ko.isObservable(actual.class.obs))
  t.false(ko.isObservable(actual.class.obs().foo))

  t.deepEqual(ko.toJS(actual), ko.toJS(raw))
})

const testArrays = (mapArraysArg, shouldMapArrays) => (t) => {
  const actual = fromJS({
    foo: ['foo']
  }, mapArraysArg)

  t.true(ko.isObservable(actual.foo))
  t[shouldMapArrays ? 'true' : 'false'](ko.isObservable(actual.foo()[0]))
  t.is(ko.toJS(actual.foo()[0]), 'foo')
}

test('should create shallow arrays when 2rd arg is undefined', testArrays())
test('should create shallow arrays when 2rd arg is falsy', testArrays(false))
test('should create deep arrays when 2rd arg is true', testArrays(null))
