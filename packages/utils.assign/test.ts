import '@profiscience/knockout-contrib-jest-matchers'
import * as ko from 'knockout'
import { assign } from './index'

describe('utils.merge', () => {
  test('creates a deep observable tree', () => {
    const actual = {
      existingUntouched: 'old',
      existingNonObservable: 'old',
      existingObservable: ko.observable('old'),
      existingObject: {
        existingUntouched: 'old',
        existingNonObservable: 'old'
      }
    } as any

    assign(actual, {
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

    expect(actual.existingNonObservable).not.toBeObservable()
    expect(actual.existingObservable).toBeObservable()
    expect(actual.existingObject.existingNonObservable).not.toBeObservable()
    expect(actual.existingObject.newProperty).toBeObservable()
    expect(actual.existingObject.newObject.foo).toBeObservable()
    expect(actual.newProperty).toBeObservable()

    expect(ko.toJS(actual)).toEqual({
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

  test('does nothing when merging identical values', () => {
    const actual = { foo: ko.observable('foo') }
    assign(actual, { foo: 'foo' })
    expect(actual.foo).toBeObservable()
    expect(ko.toJS(actual)).toEqual({ foo: 'foo' })
  })

  test('unsets explicitly undefined properties', () => {
    const actual = { foo: 'foo' }
    assign(actual, { foo: undefined })
    expect(actual.foo).not.toBeObservable()
    expect(ko.toJS(actual)).toEqual({ foo: undefined })
  })

  test('supports null destination properties', () => {
    const dest: any = { foo: null }
    assign(dest, { foo: null })
    expect(dest.foo).toBeNull()
  })

  const testArrays = (
    mapArraysArg?: boolean,
    shouldMapArrays?: boolean
  ) => () => {
    _test({})
    _test({ foo: ko.observableArray([]) })

    function _test(actual: any) {
      assign(
        actual,
        { foo: ['foo'] },
        {
          mapArrayElements: mapArraysArg
        }
      )

      expect(actual.foo).toBeObservable()
      expect(ko.toJS(actual.foo()[0])).toBe('foo')
      shouldMapArrays
        ? expect(actual.foo()[0]).toBeObservable()
        : expect(actual.foo()[0]).not.toBeObservable()
    }
  }

  test(
    'creates/sets shallow arrays when 3rd arg is undefined',
    testArrays(undefined, false)
  )
  test(
    'creates/sets shallow arrays when 3rd arg is falsy',
    testArrays(null as any, false)
  )
  test(
    'creates/sets shallow arrays when 3rd arg is false',
    testArrays(false, false)
  )
  test('creates/sets deep arrays when 3rd arg is true', testArrays(true, true))

  test('strict only uses existing observables', () => {
    const dest: any = {
      foo: ko.observable(),
      deep: {
        foo: ko.observable()
      }
    }
    const src = {
      foo: 'foo',
      bar: 'bar',
      deep: {
        foo: 'foo',
        bar: 'bar'
      }
    }
    assign(dest, src, { strict: true })

    expect(dest.foo).toBeObservable()
    expect(dest.bar).not.toBeObservable()
    expect(dest.deep.foo).toBeObservable()
    expect(dest.deep.bar).not.toBeObservable()
  })
})
