import { noop } from 'lodash'
import * as ko from 'knockout'
import { Query } from './src'

describe('querystring', () => {
  test('Query#fromQS() returns empty object if no querystring', () => {
    history.replaceState(null, '', location.pathname)

    expect(Query.fromQS()).toEqual({})
  })

  test('Query#fromQS(<group>) returns empty object if no params for group', () => {
    history.replaceState(null, '', location.pathname)

    expect(Query.fromQS('group')).toEqual({})
  })

  test('explicit initialization', () => {
    history.replaceState(
      null,
      '',
      location.pathname + '?{"foo": "notfoo", "baz": false}'
    )

    const query = Query.create({ foo: 'foo', bar: 'bar', baz: true })

    expect(query.foo()).toBe('notfoo')
    expect(query.bar()).toBe('bar')
    expect(query.baz()).toBe(false)

    query.dispose()
  })

  test('url parsing', () => {
    history.replaceState(null, '', location.pathname + '#hash')

    const query = Query.create({ foo: '' })

    query.foo('foo')
    ko.tasks.runEarly()

    expect(location.hash).toBe('#hash')

    query.dispose()
  })

  test('hashbang', () => {
    history.replaceState(
      null,
      '',
      location.pathname + '#!/path?{"foo":"notfoo"}'
    )

    const query = Query.create({ foo: 'foo' })

    expect(query.foo()).toBe('notfoo')

    query.foo('bar')
    ko.tasks.runEarly()
    expect(location.hash).toBe(`#!/path?${encodeURIComponent('{"foo":"bar"}')}`)

    query.foo('foo')
    ko.tasks.runEarly()
    expect(location.hash).toBe('#!/path')

    query.foo('baz')
    ko.tasks.runEarly()
    expect(location.hash).toBe(`#!/path?${encodeURIComponent('{"foo":"baz"}')}`)

    query.dispose()
  })

  test('empty query', () => {
    history.replaceState(null, '', location.pathname)

    const query = Query.create({ foo: '' })

    query.foo('foo')
    query.foo(undefined as any)
    ko.tasks.runEarly()

    expect(location.pathname).toBe(location.pathname + location.search)
    query.dispose()
  })

  test('writability', () => {
    const query = Query.create({ foo: 'foo' })

    query.foo('bar')
    ko.tasks.runEarly()

    expect(Query.parse(location.search.substring(1)).foo).toBe('bar')

    query.foo('foo')
    ko.tasks.runEarly()
    expect(Query.parse(location.search.substring(1)).foo).toBeUndefined()

    query.foo('')
    ko.tasks.runEarly()

    expect(Query.parse(location.search.substring(1)).foo).toBeUndefined()

    query.foo([] as any)

    ko.tasks.runEarly()
    expect(Query.parse(location.search.substring(1)).foo).toBeUndefined()

    query.dispose()
  })

  test('default fall-back', () => {
    history.replaceState(null, '', location.pathname + '?{"foo": "notfoo"}')

    const query = Query.create({ foo: 'foo' })

    query.foo(undefined as any)

    expect(query.toJS().foo).toBe('foo')

    query.dispose()
  })

  test('advanced', () => {
    history.replaceState(null, '', location.pathname + '?{"foo": "notfoo"}')

    const query = Query.create({
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
        coerce: (v) => (v.length === 0 ? ['baz'] : v)
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
    history.replaceState(null, '', location.pathname + '?{"foo": "bar"}')

    const query = Query.create({ foo: 'foo' })

    expect(query.foo.isDefault()).toBe(false)

    query.foo('foo')

    expect(query.foo.isDefault()).toBe(true)

    query.dispose()
  })

  test('query[param]#clear', () => {
    history.replaceState(null, '', location.pathname + '?{"foo": "bar"}')

    const query = Query.create({ foo: 'foo' })

    query.foo.clear()

    expect(query.foo()).toBe('foo')

    query.dispose()
  })

  test('#set', () => {
    history.replaceState(null, '', location.pathname + '?{"bar": "foo"}')

    const query = Query.create({ foo: 'foo', bar: 'bar' })

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
    history.replaceState(null, '', location.pathname + '?{"bar": "foo"}')

    const query = Query.create({ foo: 'foo', bar: 'bar' })

    query.foo.set('notfoo')
    query.bar.set('notbar')

    expect(query.foo()).toBe('notfoo')
    expect(query.bar()).toBe('foo')

    query.clear()

    expect(query.toJS()).toEqual({ foo: 'notfoo', bar: 'notbar' })

    query.dispose()
  })

  test('query[param]#set', () => {
    history.replaceState(null, '', location.pathname + '?{"bar": "foo"}')

    const query = Query.create({ foo: 'foo', bar: 'bar' })

    query.foo.set({
      default: 'bar',
      coerce: (foo: any) => (foo === 'foo' ? 'foo' : 'notfoo')
    })
    query.bar.set({ default: 'notbar', initial: 'baz' })

    expect(query.foo()).toBe('notfoo')
    expect(query.bar()).toBe('baz')

    query.clear()

    expect(query.toJS()).toEqual({ foo: 'notfoo', bar: 'notbar' })

    query.dispose()
  })

  test('#toJS', () => {
    history.replaceState(null, '', location.pathname + '?{"foo": "foo"}')

    const query = Query.create({ foo: undefined })

    expect(query.toJS()).toEqual({ foo: 'foo' })

    query.foo(undefined)

    expect(query.toJS()).toEqual({})

    query.dispose()
  })

  test('#toString', () => {
    history.replaceState(null, '', location.pathname)

    const query = Query.create({ foo: 'foo' })

    expect(Query.stringify({ foo: 'foo' })).toEqual(query.toString())

    query.dispose()
  })

  test('#asObservable', (done) => {
    history.replaceState(null, '', location.pathname)

    const query = Query.create({ foo: '' })
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

    query.foo('')

    expect(q()).toEqual({ foo: '' })

    query.foo('bar')

    expect(q()).toEqual({ foo: 'bar' })

    query.dispose()
  })

  test('#clear', () => {
    history.replaceState(
      null,
      '',
      location.pathname + '?{"foo": "notfoo", "bar": "notbar"}'
    )
    const defaults = { foo: 'foo', bar: 'bar' }
    const query = Query.create(defaults)

    query.clear()

    expect(query.toJS()).toEqual(defaults)

    query.dispose()
  })

  test('#dispose', () => {
    history.replaceState(null, '', location.pathname)

    const a1 = Query.create({ foo: '' }, 'a')
    const a2 = Query.create({ foo: '' }, 'a')

    a1.foo('foo')
    ko.tasks.runEarly()

    a1.dispose()
    ko.tasks.runEarly()

    expect(Query.parse(location.search.substring(1))).toEqual({
      a: { foo: 'foo' }
    })

    a2.dispose()
    ko.tasks.runEarly()

    expect(Query.parse(location.search.substring(1))).toEqual({})
  })

  test('reacts to external history api changes', () => {
    const query = Query.create({ foo: '' })
    expect(query.foo()).toBe('')

    history.replaceState(null, '', location.pathname + '?{"foo": "bar"}')

    expect(query.foo()).toBe('bar')

    query.dispose()
  })

  test('grouped/multiple queries', () => {
    const a = Query.create({ foo: '' }, 'a')
    const b = Query.create({ foo: '' }, 'b')

    a.foo('foo')
    b.foo('notfoo')
    ko.tasks.runEarly()

    expect(a.foo()).toBe('foo')
    expect(b.foo()).toBe('notfoo')
    expect(Query.parse(location.search.substring(1))).toEqual({
      a: { foo: 'foo' },
      b: { foo: 'notfoo' }
    })

    a.dispose()
    b.dispose()
  })

  test('linked queries', () => {
    const a1 = Query.create({ foo: '', bar: undefined, baz: undefined }, 'a')
    const a2 = Query.create({ foo: '', bar: 'bar', baz: undefined }, 'a')

    a1.foo('foo')

    ko.tasks.runEarly()

    expect(a2.foo()).toBe('foo')

    a1.dispose()

    const a3 = Query.create({ foo: undefined, bar: undefined, baz: '' }, 'a')

    a3.baz('baz')

    ko.tasks.runEarly()

    expect(a2.baz()).toBe('baz')

    a2.dispose()
    a3.dispose()
  })

  test('Query#setParser({ parse, stringify })', () => {
    Query.setParser({
      parse: (str) => ({ foo: str.replace('foo=', '') }),
      stringify: (obj: { foo: string }) => 'foo=' + obj.foo
    })

    history.replaceState(null, '', location.pathname + '?foo=foo')

    const q = Query.create({ foo: '' })

    expect(q.foo()).toBe('foo')

    q.foo('bar')
    ko.tasks.runEarly()

    expect(window.location.search).toBe('?foo=bar')

    q.dispose()
  })

  test('Query#fromQS() returns qs params from all groups', () => {
    history.replaceState(null, '', location.pathname + '?foo=foo')

    expect(Query.fromQS()).toEqual({ foo: 'foo' })
  })

  test('logs a warning if the constructor is used directly', () => {
    // tslint:disable-next-line:no-console
    console.warn = jest.fn()

    const query = new Query({ foo: 'foo' })

    // tslint:disable-next-line:no-console
    expect(console.warn).toHaveBeenLastCalledWith(
      '[@profiscience/knockout-contrib] Use the Query.create() factory function instead of `new`'
    )

    query.dispose()
  })
})

// test type definitions
{
  const q = Query.create({ foo: { default: '' } })

  // the following line should not throw a compiler error
  const foo: string = q.foo()

  noop(foo)

  q.dispose()
}
