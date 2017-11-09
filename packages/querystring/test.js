import * as ko from 'knockout'
import * as jsdom from 'jsdom'
import Query from './src'

test('explicit initialization', () => {
  history.replaceState(null, null, location.pathname + '?{"foo": "notfoo", "baz": false}')

  const query = new Query({ foo: 'foo', bar: 'bar', baz: true })

  expect(query.foo()).toBe('notfoo')
  expect(query.bar()).toBe('bar')
  expect(query.baz()).toBe(false)

  query.dispose()
})

test('url parsing', () => {
  history.replaceState(null, null, location.pathname + '#hash')

  const query = new Query({ foo: undefined })

  query.foo('foo')
  ko.tasks.runEarly()  
  
  expect(location.hash).toBe('#hash')

  query.dispose()
})

test('empty query', () => {
  history.replaceState(null, null, location.pathname)

  const query = new Query({ foo: undefined })

  query.foo('foo')
  query.foo(undefined)
  ko.tasks.runEarly()

  expect(location.pathname).toBe(location.pathname + location.search)
  query.dispose()
})

test('writability', () => {
  const query = new Query({ foo: 'foo' })

  query.foo('bar')
  ko.tasks.runEarly()

  expect(Query.parse(location.search.substring(1)).foo).toBe('bar')

  query.foo('foo')
  ko.tasks.runEarly()
  expect(Query.parse(location.search.substring(1)).foo).toBeUndefined()

  query.foo('')
  ko.tasks.runEarly()

  expect(Query.parse(location.search.substring(1)).foo).toBeUndefined()

  query.foo([])
  ko.tasks.runEarly()
  expect(Query.parse(location.search.substring(1)).foo).toBeUndefined()

  query.dispose()
})

test('default fall-back', () => {
  history.replaceState(null, null, location.pathname + '?{"foo": "notfoo"}')

  const query = new Query({ foo: 'foo' })

  query.foo(undefined)

  expect(query.toJS().foo).toBe('foo')

  query.dispose()
})

test('advanced', () => {
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

  expect(q.foo).toBe('notfoo')
  expect(q.bar).toBe('notbar')

  query.clear()
  ko.tasks.runEarly()

  q = query.toJS()

  expect(q.foo).toBe('foo')
  expect(q.baz[0]).toBe('baz')

  query.dispose()
})

test('query[param]#isDefault', () => {
  history.replaceState(null, null, location.pathname + '?{"foo": "bar"}')

  const query = new Query({ foo: 'foo' })

  expect(query.foo.isDefault()).toBe(false)  
  
  query.foo('foo')

  expect(query.foo.isDefault()).toBe(true)

  query.dispose()
})

test('query[param]#clear', () => {
  history.replaceState(null, null, location.pathname + '?{"foo": "bar"}')

  const query = new Query({ foo: 'foo' })

  query.foo.clear()

  expect(query.foo()).toBe('foo')

  query.dispose()
})

test('#set', () => {
  history.replaceState(null, null, location.pathname + '?{"bar": "foo"}')

  const query = new Query({ foo: 'foo', bar: 'bar' })

  query.set({
    foo: 'notfoo',
    bar: 'notbar'
  })

  expect(query.foo()).toBe('notfoo')
  expect(query.bar()).toBe('foo')

  query.clear()

  expect(query.toJS()).toEqual({ foo: 'notfoo', bar: 'notbar' })

  query.dispose()
})

test('query[param]#set shorthand', () => {
  history.replaceState(null, null, location.pathname + '?{"bar": "foo"}')

  const query = new Query({ foo: 'foo', bar: 'bar' })

  query.foo.set('notfoo')
  query.bar.set('notbar')

  expect(query.foo()).toBe('notfoo')
  expect(query.bar()).toBe('foo')

  query.clear()  
  
  expect(query.toJS()).toEqual({ foo: 'notfoo', bar: 'notbar' })

  query.dispose()
})

test('query[param]#set', () => {
  history.replaceState(null, null, location.pathname + '?{"bar": "foo"}')

  const query = new Query({ foo: 'foo', bar: 'bar' })

  query.foo.set({ default: 'bar', coerce: (foo) => foo === 'foo' ? 'foo' : 'notfoo' })
  query.bar.set({ default: 'notbar', initial: 'baz' })

  expect(query.foo()).toBe('notfoo')
  expect(query.bar()).toBe('baz')

  query.clear()

  expect(query.toJS()).toEqual({ foo: 'notfoo', bar: 'notbar' })

  query.dispose()
})

test('#toJS', () => {
  history.replaceState(null, null, location.pathname + '?{"foo": "foo"}')

  const query = new Query({ foo: undefined })

  expect(query.toJS()).toEqual({ foo: 'foo' })

  query.foo(undefined)

  expect(query.toJS()).toEqual({})

  query.dispose()
})

test('#toString', () => {
  history.replaceState(null, null, location.pathname)

  const query = new Query({ foo: 'foo' })  

  expect(Query.stringify({ foo: 'foo' })).toEqual(query.toString())

  query.dispose()
})

test('#asObservable', (done) => {
  history.replaceState(null, null, location.pathname)

  const query = new Query({ foo: undefined })
  const q = query.asObservable()

  const killMe = q.subscribe(() => {
    expect(q()).toEqual({ foo: 'foo' })
    killMe.dispose()
    done()
  })

  query.foo('foo')
  ko.tasks.runEarly()

  expect(ko.isObservable(q)).toBeTruthy()
  expect(q()).toEqual({ foo: 'foo' })

  query.foo(undefined)
  
  expect(q()).toEqual({})

  query.foo('bar')

  expect(q()).toEqual({ foo: 'bar' })

  query.dispose()
})

test('#clear', () => {
  history.replaceState(null, null, location.pathname + '?{"foo": "notfoo", "bar": "notbar"}')
  const defaults = { foo: 'foo', bar: 'bar' }
  const query = new Query(defaults)

  query.clear()

  expect(query.toJS()).toEqual(defaults)

  query.dispose()
})

test('#dispose', () => {
  history.replaceState(null, null, location.pathname)

  const a1 = new Query({ foo: undefined }, 'a')
  const a2 = new Query({ foo: undefined }, 'a')

  a1.foo('foo')
  ko.tasks.runEarly()

  a1.dispose()
  ko.tasks.runEarly()

  expect(Query.parse(location.search.substring(1))).toEqual({ a: { foo: 'foo' } })  
  
  a2.dispose()
  ko.tasks.runEarly()

  expect(Query.parse(location.search.substring(1))).toEqual({})
})

test('grouped/multiple queries', () => {
  const a = new Query({ foo: undefined }, 'a')
  const b = new Query({ foo: undefined }, 'b')

  a.foo('foo')
  b.foo('notfoo')
  ko.tasks.runEarly()

  expect(a.foo()).toBe('foo')
  expect(b.foo()).toBe('notfoo')
  expect(Query.parse(location.search.substring(1))).toEqual({ a: { foo: 'foo' }, b: { foo: 'notfoo' } })

  a.dispose()
  b.dispose()
})

test('linked queries', () => {
  const a1 = new Query({ foo: undefined, bar: undefined }, 'a')
  const a2 = new Query({ foo: undefined, bar: 'bar', baz: undefined }, 'a')

  a1.foo('foo')

  ko.tasks.runEarly()

  expect(a2.foo()).toBe('foo')

  a1.dispose()

  const a3 = new Query({ baz: undefined }, 'a')

  a3.baz('baz')

  ko.tasks.runEarly()

  expect(a2.baz()).toBe('baz')

  a2.dispose()
  a3.dispose()
})

test('Query#setParser({ parse, stringify })', () => {
  history.replaceState(null, null, location.pathname + '?foo=foo')

  Query.setParser({
    parse: (str) => ({ foo: str.replace('foo=', '') }),
    stringify: (obj) => 'foo=' + obj.foo
  })

  const q = new Query({ foo: undefined })

  expect(q.foo()).toBe('foo')

  q.foo('bar')
  ko.tasks.runEarly()

  expect(window.location.search).toBe('?foo=bar')

  q.dispose()
})