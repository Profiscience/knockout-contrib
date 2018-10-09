# query

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

> This package is intended for consumption via the [@profiscience/knockout-contrib](../_) metapackage

Persistent, stateless read/write querystring abstraction for KnockoutJS.

## Basic Usage

```javascript
import { Query } from '@profiscience/knockout-contrib'

const query = Query.create({ sort: 'alpha' })

query.sort() // alpha
```

## API

### Query.create([config = {}, name])

Create a new query instance passing a configuration object and optionally a name to group
the query with. This allows you to create multiple query objects with the same params,
and they will not interfere with each other. It also allows you to link queries if they
are given the same group name.

The configuration object contains key/value pairs of querystring param names and
their config, respectively. A querystring param config may be an object that
contains any combination of three props, `default`, `initial`, and `coerce`, or
a value which will be used as the default and initial value. The `coerce` function
allows you to transform a value before it is fully set.

```javascript
const query = Query.create({
  // query param named foo
  foo: {
    default: 'foo',
    initial: 'bar',
    coerce: (v) => (v === 'baz' ? 'qux' : v)
  },

  bar: 'bar'
})
```

In this case, the foo param will be set to "bar" initially — if not already in
the querystring — but call to `query.clear()` will then set it to "foo". The `coerce`
function disallows setting the param to "baz", and attempting to will cause it
to be set to "qux" instead.

**NOTE:** Params that are equal to their default will _not_ be displayed in the
querystring. Less === More.

### Query.reload()

Reload query instances if external changes occur (e.g. querystring modified via pushState/replaceState). Usually you don't need to call this directly, as long as you include the [query router middleware](../router.middleware.query), if you are using the [router](../router).

### Query.fromQS([group])

Returns JS object containing current query from URL — for group if any.

### Query.setParser({ parse, stringify })

By default, this lib is dumb, and it **does not** use valid querystrings. Instead,
it uses `JSON.stringify` and `encodeURIComponent`, and vice versa. This function allows
you to define a custom parser.

e.g.

```javascript
import Query from 'ko-querystring'
import rison from 'rison' // https://github.com/Nanonid/rison

Query.setParser({
  parse: rison.decode_object,
  stringify: rison.encode_object
})
```

### query[param]

Query params are created via super-cool ES6 proxies, so you don't need to explicitly
define all the query params you will use. Simply access them, and they are there.

Params will be initialized from the querystring if available, and their default
value or undefined if not.

### query[param].clear()

Resets param to its default or undefined.

### query[param].isDefault

Observable value that is true if the param is its default value, otherwise false.

### query.set(default || { default, initial, coerce })

Change the default values for a query.

### query.clear()

Reset all the query params to their defined defaults, or undefined.

### query.toJS()

Returns unwrapped query object.

### query.toString()

Returns stringified query.

### query.asObservable()

Return observable query object.
i.e. ko.observable({ foo: 'foo' }) instead of { foo: ko.observable('foo') }

### query.dispose()

Disposes the query object and cleans the querystring. Don't forget to clean up after 'yo self.

## MOAR!

Check the test file or the source. This lib is small enough to understand inside
and out.

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/querystring
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/querystring
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/querystring&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/querystring
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/querystring&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/querystring
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-querystring
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-querystring.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-querystring&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-querystring.svg?maxAge=2592000
[gitter]: https://gitter.im/Profiscience/ko-component-querystring
[gitter-shield]: https://img.shields.io/gitter/room/profiscience/ko-component-querystring.svg
