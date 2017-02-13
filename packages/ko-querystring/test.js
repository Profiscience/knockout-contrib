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

    test('url parsing', (t) => {
      history.replaceState(null, null, location.pathname + '#hash')

      const query = new Query({ foo: undefined })

      query.foo('foo')
      ko.tasks.runEarly()

      t.equals('#hash', location.hash, 'preserves hash')

      query.dispose()
      t.end()
    })

    test('empty query', (t) => {
      history.replaceState(null, null, location.pathname)

      const query = new Query({ foo: undefined })

      query.foo('foo')
      query.foo(undefined)
      ko.tasks.runEarly()

      t.equals(location.pathname, location.pathname + location.search)
      query.dispose()
      t.end()
    })

    test('writability', (t) => {
      const query = new Query({ foo: 'foo' })

      query.foo('bar')
      ko.tasks.runEarly()

      t.equals('bar', Query.parse(location.search.substring(1)).foo, 'writes changes to querystring')

      query.foo('foo')
      ko.tasks.runEarly()
      t.equals(undefined, Query.parse(location.search.substring(1)).foo, 'omits defaults from querystring')

      query.foo('')
      ko.tasks.runEarly()
      t.equals(undefined, Query.parse(location.search.substring(1)).foo, 'omits empty strings from querystring when not ')

      query.foo([])
      ko.tasks.runEarly()
      t.equals(undefined, Query.parse(location.search.substring(1)).foo, 'omits empty arrays from querystring')

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

    test('advanced', (t) => {
      history.replaceState(null, null, location.pathname + '?{"foo": "notfoo"}')

      const query = new Query({
        foo: {
          default: 'foo',
          initial: 'bar'
        },
        bar: {
          default: 'bar',
          initial: 'notbar'
        },
        baz: {
          default: [],
          coerce: (v) => v.length === 0 ? ['baz'] : v
        }
      })

      let q = query.toJS()

      t.equals('notfoo', q.foo, 'does not use the default or initial value when in querystring')
      t.equals('notbar', q.bar, 'uses the initial value for undefined query params')

      query.clear()
      ko.tasks.runEarly()

      q = query.toJS()

      t.equals('foo', q.foo, 'uses default value')
      t.equals('baz', q.baz[0], 'corercion works')

      query.dispose()
      t.end()
    })

    test('query[param]#isDefault', (t) => {
      history.replaceState(null, null, location.pathname + '?{"foo": "bar"}')

      const query = new Query({ foo: 'foo' })

      t.notOk(query.foo.isDefault(), 'query.param.isDefault() is false when not default')

      query.foo('foo')

      t.ok(query.foo.isDefault(), 'query[param]#isDefault() is true when default')

      query.dispose()
      t.end()
    })

    test('query[param]#clear', (t) => {
      history.replaceState(null, null, location.pathname + '?{"foo": "bar"}')

      const query = new Query({ foo: 'foo' })

      query.foo.clear()

      t.equals('foo', query.foo(), 'query[param]#clear resets param to default value')

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

      const query = new Query({ foo: undefined })

      t.deepEquals({ foo: 'foo' }, query.toJS(), 'returns unwrapped query object')

      query.foo(undefined)

      t.deepEquals({}, query.toJS(), 'omits undefined values')

      query.dispose()
      t.end()
    })

    test('#toString', (t) => {
      history.replaceState(null, null, location.pathname)

      const query = new Query({ foo: 'foo' })

      t.deepEquals(Query.stringify({ foo: 'foo' }), query.toString(), 'returns stringified query object')

      query.dispose()
      t.end()
    })

    test('#asObservable', (t) => {
      t.plan(5)

      history.replaceState(null, null, location.pathname)

      const query = new Query({ foo: undefined })
      const q = query.asObservable()

      const killMe = q.subscribe(() => {
        t.deepEquals({ foo: 'foo' }, q(), 'is subscribe-able to new query params')
        killMe.dispose()
      })

      query.foo('foo')
      ko.tasks.runEarly()

      t.ok(ko.isObservable(q), 'returns observable')
      t.deepEquals({ foo: 'foo' }, q(), 'contains query')

      query.foo(undefined)
      t.deepEquals({}, q(), 'omits undefined values')

      query.foo('bar')
      t.deepEquals({ foo: 'bar' }, q(), 'updates correctly')

      query.dispose()
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

    test('#dispose', (t) => {
      history.replaceState(null, null, location.pathname)

      const a1 = new Query({ foo: undefined }, 'a')
      const a2 = new Query({ foo: undefined }, 'a')

      a1.foo('foo')
      ko.tasks.runEarly()

      a1.dispose()
      ko.tasks.runEarly()

      t.deepEquals({ a: { foo: 'foo' } }, Query.parse(location.search.substring(1)), 'does not remove query if linked group remains')

      a2.dispose()
      ko.tasks.runEarly()

      t.deepEquals({}, Query.parse(location.search.substring(1)), 'removes query if no linked groups remains')

      t.end()
    })

    test('grouped/multiple queries', (t) => {
      const a = new Query({ foo: undefined }, 'a')
      const b = new Query({ foo: undefined }, 'b')

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
      const a1 = new Query({ foo: undefined, bar: undefined }, 'a')
      const a2 = new Query({ foo: undefined, bar: 'bar', baz: undefined }, 'a')

      a1.foo('foo')

      ko.tasks.runEarly()

      t.equals('foo', a2.foo(), 'links')

      a1.dispose()

      const a3 = new Query({ baz: undefined }, 'a')

      a3.baz('baz')
      
      ko.tasks.runEarly()

      t.equals('baz', a2.baz(), 'works after a linked query is disposed')

      a2.dispose()
      a3.dispose()
      t.end()
    })

    test('Query#setParser({ parse, stringify })', (t) => {
      history.replaceState(null, null, location.pathname + '?foo=foo')

      Query.setParser({
        parse: (str) => ({ foo: str.replace('foo=', '') }),
        stringify: (obj) => 'foo=' + obj.foo
      })

      const q = new Query({ foo: undefined })

      t.equals(q.foo(), 'foo', 'uses custom parse function')

      q.foo('bar')
      ko.tasks.runEarly()

      t.equals(window.location.search, '?foo=bar', 'uses custom stringifier')

      q.dispose()
      t.end()
    })
  }
})

$(() => {
  $('body').append('<test></test>')
  ko.applyBindings()
})
