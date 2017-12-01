import '@profiscience/knockout-contrib-jest-matchers'
import * as ko from 'knockout'
import fromJS from './index'

test('should create a deep observable tree', () => {
  const raw = {
    num: 1,
    str: 'str',
    date: new Date(),
    bool: true,
    arr: [],
    regexp: /foo/,
    obj: { foo: 'foo' },
    obs: ko.observable({ foo: 'bar' }),
    func() { }, // tslint:disable-line no-empty
    class: new class {
      public num = 1
      public str = 'str'
      public date = new Date()
      public bool = true
      public arr = []
      public obj = { foo: 'foo' }
      public obs = ko.observable({ foo: 'bar' })
      public regexp = /foo/
      public func() { } // tslint:disable-line no-empty
    }()
  }

  const actual = fromJS(raw)

  expect(actual.num).toBeObservable()
  expect(actual.str).toBeObservable()
  expect(actual.date).toBeObservable()
  expect(actual.bool).toBeObservable()
  expect(actual.arr).toBeObservable()
  expect(actual.regexp).toBeObservable()
  expect(actual.obj).not.toBeObservable()
  expect(actual.obj.foo).toBeObservable()
  expect(actual.obs).toBeObservable()
  expect(actual.obs().foo).not.toBeObservable()
  expect(actual.func).not.toBeObservable()
  expect(actual.class).not.toBeObservable()

  expect(actual.class.num).toBeObservable()
  expect(actual.class.str).toBeObservable()
  expect(actual.class.date).toBeObservable()
  expect(actual.class.bool).toBeObservable()
  expect(actual.class.arr).toBeObservable()
  expect(actual.class.regexp).toBeObservable()
  expect(actual.class.obj).not.toBeObservable()
  expect(actual.class.obj.foo).toBeObservable()
  expect(actual.class.obs).toBeObservable()
  expect(actual.class.obs().foo).not.toBeObservable()

  expect(ko.toJS(actual)).toEqual(ko.toJS(raw))
})

const testArrays = (mapArraysArg: undefined | null | boolean, shouldMapArrays: boolean) => () => {
  const actual = fromJS({ foo: ['foo'] }, mapArraysArg as boolean)

  expect(actual.foo).toBeObservable()
  expect(ko.toJS(actual.foo()[0])).toBe('foo')
  shouldMapArrays
    ? expect(actual.foo()[0]).toBeObservable()
    : expect(actual.foo()[0]).not.toBeObservable()
}

test('creates shallow arrays when 2rd arg is undefined', testArrays(undefined, false))
test('creates shallow arrays when 2rd arg is falsy', testArrays(null, false))
test('creates shallow arrays when 2rd arg is false', testArrays(false, false))
test('creates deep arrays when 2rd arg is true', testArrays(true, true))
