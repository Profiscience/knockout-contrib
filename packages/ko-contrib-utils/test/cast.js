import test from 'ava'
import ko from 'knockout'
import cast from '../src/cast'

test('should cast to observable', (t) => {
  t.is(cast(undefined)(), undefined)
  t.is(cast(undefined, 'foo')(), 'foo')
  t.is(cast(ko.observable())(), undefined)
  t.is(cast(ko.observable(), 'foo')(), 'foo')
  t.is(cast(ko.observable('foo'))(), 'foo')
  t.is(cast(ko.observable('foo'), 'bar')(), 'foo')
})
