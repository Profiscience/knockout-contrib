import 'jest'

import * as utils from './utils'

describe('utils', () => {
  test('nonenumerable', () => {
    const obj = {
      foo: 'foo',
      bar: 'bar',
      dontIncludeThis: 'no good',
      baz: 'baz'
    }
    utils.nonenumerable(obj, 'dontIncludeThis')

    expect(Object.keys(obj)).toEqual(['foo', 'bar', 'baz'])
  })
})
