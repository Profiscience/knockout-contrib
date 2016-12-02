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

### new Query(defaults[, name])
Create a new query object using the `new` keyword, and pass the default values,
and optionally a name to group the query with. This allows you to create multiple
query objects with the same params, and they will not interfere with each other.
It also allows you to link queries if they are given the same group name.

__NOTE:__ Params that are equal to their default will _not_ be displayed in the
querystring. Less === More.

### query[param]
Query params are created via super-cool ES6 proxies, so you don't need to explicitly
define all the query params you will use. Simply access them, and they are there.

Params will be initialized from the querystring if available, and their default
value or undefined if not.

### query.setDefaults(defaults)
Set or change the default values for a query.

### query.clear
Reset all the query params to their defined defaults, or undefined.

### query.dispose
Disposes the query object and cleans the querystring. Don't forget to clean up after 'yo self.

## Using a custom querystring parser
By default, this lib is dumb, and it **does not** use valid querystrings. Instead,
it uses `JSON.stringify` and `encodeURIComponent`, and vice versa. To use another
parser, just replace the `parse` and `stringify` functions on `Query`.

```javascript
import Query from 'ko-querystring'
import rison from 'rison' // https://github.com/Nanonid/rison

Query.parse = rison.decode_object
Query.stringify = rison.encode_object
```

## MOAR!

Check the test file or the source. This lib is small enough to understand inside
and out.
