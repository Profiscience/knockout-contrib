import ko from 'knockout'
import test from 'tape'
import $ from 'jquery'

import Query from './src'

ko.components.register('test', {
  template: '<div></div>',
  viewModel() {
    test('explicit initialization', (t) => {
      history.replaceState(null, null, location.pathname + '?{"foo": "notfoo"}')

      const query = new Query({ foo: 'foo', bar: 'bar' })

      t.equals('notfoo', query.foo(), 'should be initialized from query string')
      t.equals('bar', query.bar(), 'should fall back to default')

      query.dispose()
      t.end()
    })

    test('implicit initialization', (t) => {
      history.replaceState(null, null, location.pathname + '?{"foo": "foo"}')

      const query = new Query()

      t.ok(ko.isWritableObservable(query.foo), 'can be created on-the-fly')
      t.equals('foo', query.foo(), 'implicit params are initialized from query string')

      query.dispose()
      t.end()
    })

    test('url parsing', (t) => {
      history.replaceState(null, null, location.pathname + '#hash')

      const query = new Query()

      query.foo('foo')
      ko.tasks.runEarly()

      t.equals('#hash', location.hash, 'preserves hash')

      query.dispose()
      t.end()
    })

    test('empty query', (t) => {
      history.replaceState(null, null, location.pathname)

      const query = new Query()

      query.foo('foo')
      query.foo(undefined)
      ko.tasks.runEarly()

      t.equals(location.pathname, location.pathname + location.search)
      query.dispose()
      t.end()
    })

    test('writability', (t) => {
      const query = new Query()

      query.foo('foo')
      ko.tasks.runEarly()

      t.equals('foo', Query.parse(location.search.substring(1)).foo, 'writes changes to querystring')

      query.dispose()
      t.end()
    })

    test('default fall-back', (t) => {
      history.replaceState(null, null, location.pathname + '?{"foo": "notfoo"}')

      const query = new Query({ foo: 'foo' })

      query.foo(undefined)

      t.equals('foo', query.toJS().foo, 'falls back to default value when set to undefined')

      query.dispose()
      t.end()
    })

    test('#setDefaults', (t) => {
      history.replaceState(null, null, location.pathname + '?{"bar": "foo"}')

      const query = new Query({ foo: 'foo', bar: 'bar' })

      query.setDefaults({
        foo: 'notfoo',
        bar: 'notbar'
      })

      t.equals('notfoo', query.foo(), '#setDefaults updates query params w/ default value to new default')
      t.equals('foo', query.bar(), '#setDefaults leaves query params that are non-default alone')

      query.clear()

      t.deepEquals({ foo: 'notfoo', bar: 'notbar' }, query.toJS(), 'set defaults actually sets new defaults')

      query.dispose()
      t.end()
    })

    test('#toJS', (t) => {
      history.replaceState(null, null, location.pathname + '?{"foo": "foo"}')

      const query = new Query()

      t.deepEquals({ foo: 'foo' }, query.toJS(), 'returns unwrapped query object')

      query.foo(undefined)

      t.deepEquals({}, query.toJS(), 'omits undefined values')

      query.dispose()
      t.end()
    })

    test('#toObservable', (t) => {
      history.replaceState(null, null, location.pathname + '?{"foo": "foo"}')

      const query = new Query()
      const q = query.asObservable()

      t.ok(ko.isObservable(q), 'returns observable')
      t.deepEquals({ foo: 'foo' }, q(), 'contains query')

      query.foo(undefined)
      t.deepEquals({}, q(), 'omits undefined values')

      query.foo('bar')
      t.deepEquals({ foo: 'bar' }, q(), 'updates correctly')

      query.dispose()
      t.end()
    })

    test('#clear', (t) => {
      history.replaceState(null, null, location.pathname + '?{"foo": "notfoo", "bar": "notbar"}')
      const defaults = { foo: 'foo', bar: 'bar' }
      const query = new Query(defaults)

      query.clear()

      t.deepEquals(defaults, query.toJS(), '#clear() resets defaults')

      query.dispose()
      t.end()
    })

    test('grouped/multiple queries', (t) => {
      const a = new Query({}, 'a')
      const b = new Query({}, 'b')

      a.foo('foo')
      b.foo('notfoo')
      ko.tasks.runEarly()

      t.equals('foo', a.foo())
      t.equals('notfoo', b.foo())
      t.deepEquals({ a: { foo: 'foo' }, b: { foo: 'notfoo' } }, Query.parse(location.search.substring(1)), 'supports grouping')

      a.dispose()
      b.dispose()
      t.end()
    })

    test('linked queries', (t) => {
      const a1 = new Query({}, 'a')
      a1.foo('foo')

      const a2 = new Query({ bar: 'bar' }, 'a')

      ko.tasks.runEarly()

      t.equals('foo', a2.foo())
      t.equals('bar', a1.bar())

      a1.dispose()
      a2.dispose()
      t.end()
    })
  }
})

$(() => {
  $('body').append('<test></test>')
  ko.applyBindings()
})
