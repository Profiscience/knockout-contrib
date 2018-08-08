// tslint:disable max-classes-per-file

import { noop } from 'lodash'
import * as ko from 'knockout'
import '@profiscience/knockout-contrib-jest-matchers'
import { fromJS } from './index'

describe('utils.fromJS', () => {
  test('should create a deep observable tree', () => {
    class Clazz {
      public num = 1
      public str = 'str'
      public date = new Date()
      public bool = true
      public arr = []
      public obj = { foo: 'foo' }
      public obs = ko.observable({ foo: 'bar' })
      public regexp = /foo/
      public func() {} // tslint:disable-line no-empty
    }

    const raw = {
      num: 1,
      str: 'str',
      date: new Date(),
      bool: true,
      arr: ['foo'],
      regexp: /foo/,
      obj: { foo: 'foo' },
      obs: ko.observable({ foo: 'bar' }),
      func() {}, // tslint:disable-line no-empty
      class: new Clazz()
    }

    const actual = fromJS(raw)

    {
      // test type checking (not fool-proof)
      const num: ko.Observable<number> = actual.num
      const str: ko.Observable<string> = actual.str
      const date: ko.Observable<Date> = actual.date
      const bool: ko.Observable<boolean> = actual.bool

      const arr: ko.ObservableArray<string> = actual.arr
      const regexp: ko.Observable<RegExp> = actual.regexp
      const nestedStr: ko.Observable<string> = actual.obj.foo
      const obs: ko.Observable<{ foo: string }> = actual.obs
      const func: () => void = actual.func

      noop(num)
      noop(str)
      noop(date)
      noop(bool)
      noop(arr)
      noop(regexp)
      noop(nestedStr)
      noop(obs)
      noop(func)
    }

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

  const testArrays = (
    mapArraysArg: undefined | null | boolean,
    shouldMapArrays: boolean
  ) => () => {
    const actual = fromJS({ foo: ['foo'] }, mapArraysArg as boolean)

    expect(actual.foo).toBeObservable()
    expect(ko.toJS(actual.foo()[0])).toBe('foo')
    shouldMapArrays
      ? expect(actual.foo()[0]).toBeObservable()
      : expect(actual.foo()[0]).not.toBeObservable()
  }

  test(
    'creates shallow arrays when 2rd arg is undefined',
    testArrays(undefined, false)
  )
  test('creates shallow arrays when 2rd arg is falsy', testArrays(null, false))
  test('creates shallow arrays when 2rd arg is false', testArrays(false, false))
  test('creates deep arrays when 2rd arg is true', testArrays(true, true))

  test('preserves prototype', () => {
    class Src {
      public foo() {
        return 'foo'
      }
    }
    const src = new Src()
    const obsSrc = fromJS(src)
    expect(obsSrc.foo()).toBe('foo')
  })
})
