import * as ko from 'knockout'
import { modify } from './index'

describe('utils.modify', () => {
  test('works with observables', () => {
    const str = ko.observable('foobar')
    modify(str, reverseString)
    expect(str()).toBe('raboof')
  })
  test('works with observable arrays', () => {
    const arr = ko.observableArray(['foo', 'bar'])
    modify(arr, (v) => v.reverse())
    expect(arr()).toEqual(['bar', 'foo'])
  })
  test('works with (writeable) computeds', () => {
    const _str = ko.observable('foobar')
    const str = ko.pureComputed({
      read: () => _str(),
      write: (v) => _str(v)
    })
    modify(str, reverseString)
    expect(str()).toBe('raboof')
  })
  test('returns the new value', () => {
    const foo = ko.observable('foo')
    expect(modify(foo, () => 'bar')).toBe('bar')
  })
})

function reverseString(str: string) {
  return str
    .split('')
    .reverse()
    .join('')
}
