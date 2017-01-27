# ko-querystring

[![NPM Version](https://img.shields.io/npm/v/ko-querystring.svg)](https://www.npmjs.com/package/ko-querystring)
![WTFPL](https://img.shields.io/npm/l/ko-querystring.svg)
[![Travis](https://img.shields.io/travis/Profiscience/ko-querystring.svg)](https://travis-ci.org/Profiscience/ko-querystring)
[![Coverage Status](https://coveralls.io/repos/github/Profiscience/ko-querystring/badge.svg?branch=master)](https://coveralls.io/github/Profiscience/ko-querystring?branch=master)
[![Dependency Status](https://img.shields.io/david/Profiscience/ko-querystring.svg)](https://david-dm.org/Profiscience/ko-querystring)
[![Peer Dependency Status](https://img.shields.io/david/peer/Profiscience/ko-querystring.svg?maxAge=2592000)](https://david-dm.org/Profiscience/ko-querystring#info=peerDependencies&view=table)
[![NPM Downloads](https://img.shields.io/npm/dt/ko-querystring.svg?maxAge=2592000)](http://npm-stat.com/charts.html?package=ko-querystring&author=&from=&to=)

Easy-peasy Querystrings for Knockout

## Installation
```bash
$ npm install -S ko-querystring
```

## Basic Usage
```javascript
import Query from 'ko-querystring'

const query = new Query({ sort: 'alpha' })

query.sort() // alpha

// you can also create query parameters on the fly, e.g.
query.foo('foo')
// will create an observable on query.foo, and stick it in the querystring with
// a value of "foo"
```

## API

### new Query([config = {}, name])
Create a new query object using the `new` keyword, and pass a configuration object,
and optionally a name to group the query with. This allows you to create multiple
query objects with the same params, and they will not interfere with each other.
It also allows you to link queries if they are given the same group name.

The configuration object contains key/value pairs of querystring param names and
their config, respectively. A querystring param config may be an object that
contains any combination of three props, `default`, `initial`, and `coerce`, or
a value which will be used as the default and initial value. The `coerce` function
allows you to transform a value before it is fully set.

```javascript
const query = new Query({
  // query param named foo
  foo: {
    default: 'foo',
    initial: 'bar',
    coerce: (v) => v === 'baz' ? 'qux' : v
  },

  bar: 'bar'
})
```

In this case, the foo param will be set to "bar" initially — if not already in
the querystring — but call to `query.clear()` will then set it to "foo". The `coerce`
function disallows setting the param to "baz", and attempting to will cause it
to be set to "qux" instead.

Params to not have to be defined; attempting to access a query param not defined
in the config will create one on-the-fly and it will be `undefined` until set.

__NOTE:__ Params that are equal to their default will _not_ be displayed in the
querystring. Less === More.

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

### query.setDefaults(defaults)
Set or change the default values for a query.

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
