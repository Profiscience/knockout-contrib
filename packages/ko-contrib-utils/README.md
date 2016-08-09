# ko-contrib-utils

[![NPM Version](https://img.shields.io/npm/v/ko-contrib-utils.svg)](https://www.npmjs.com/package/ko-contrib-utils)
![WTFPL](https://img.shields.io/npm/l/ko-contrib-utils.svg)
[![Travis](https://img.shields.io/travis/Profiscience/ko-contrib-utils.svg)](https://travis-ci.org/Profiscience/ko-contrib-utils)
[![Coverage Status](https://coveralls.io/repos/github/Profiscience/ko-contrib-utils/badge.svg?branch=master)](https://coveralls.io/github/Profiscience/ko-contrib-utils?branch=master)
[![Dependency Status](https://img.shields.io/david/Profiscience/ko-contrib-utils.svg)](https://david-dm.org/Profiscience/ko-contrib-utils)
[![Peer Dependency Status](https://img.shields.io/david/peer/Profiscience/ko-contrib-utils.svg?maxAge=2592000)](https://david-dm.org/Profiscience/ko-contrib-utils#info=peerDependencies&view=table)

### Table of Contents

* Utils
  - [ko.utils.defaults](#defaultsdest-defaultvalues-maparrays--false)
  - [ko.utils.fromJS](#fromjssrc-maparrays--false)
  - [ko.utils.merge](#mergedest-src-maparrays--false)

* Prototype Functions
  - [ko.observable.fn.increment/decrement](#observablefnincrementdecrementn--1)  
  - [ko.observable.fn.subscribeOnce](#observablefnsubscribeoncefn)
  - [ko.observable.fn.toString](#observablefntostring)

### Utils

###### defaults(dest, defaultValues[, mapArrays = false])

Creates observables for enumerable string properties of `defaultValues` where undefined in the destination object.

If `mapArrays` is true, array elements will be created as mapped observables, else bare objects/primitives.

```javascript
const foos = { foo: 'foo' }
ko.utils.defaults(foos, { foo: 'bar', bar: 'bar' })

foos()
// { foo: 'foo', bar: 'bar' }
```

###### fromJS(src[, mapArrays = false])

Creates a tree of observables from `src`.

If `mapArrays` is true, array elements will be created as mapped observables, else bare objects/primitives.

The much needed inverse to the undocumented `ko.toJS` function; a dumb version of [ko.mapping.fromJS](http://knockoutjs.com/documentation/plugins-mapping.html)
that is a lot faster.

```javascript
const foos = {
  foo: 'foo',
  bar: {
    baz: 'baz',
    qux: ['qux']
  }
}

ko.utils.fromJS(foos, true)
// {
//   foo: ko.observable('foo'),
//   bar: {
//     baz: ko.observable('baz'),
//     qux: ko.observableArrap([
//       ko.observable('qux')
//     ])
//   }
// }
```

###### cast(src[, defaultValue])

If `src` IS an observable
  - and src IS NOT undefined OR NO defaultValue is provided, src is returned
  - and src IS undefined AND a defaultValue is provided, src is set to the defaultValue and returned

If `src` IS NOT an observable, a new observable is returned and then the previous logic takes over.

```javascript
function(someOptionalParam) {
  this.obs = ko.utils.cast(someOptionalParam, 'some default value')
  // obs will be observable regardless of what was passed in
}
```

###### merge(dest, src[, mapArrays = false])

For each enumerable property of src,
  a) creates an observable when undefined on dest
  b) updates when existing observable on dest
  c) sets when existing non-observable on dest.

If `mapArrays` is true, array elements will be created as mapped observables, else bare objects/primitives.
__NOTE__: Merging new arrays onto existing ones that have been mapped deep will create new observable elements,
__not__ update the existing ones. No attempts are made to key elements, nor will they. If you need more, you
probably want [ko.mapping](http://knockoutjs.com/documentation/plugins-mapping.html) which is much more powerful,
but far slower.

```javascript
const foos = {
  foo: ko.observable('foo'),
  bar: 'bar'
}

ko.utils.merge(foos, {
  foo: 'new foo',
  bar: 'new bar',
  baz: 'baz'
})

foos()
// {
//   foo: ko.observable('new foo'),
//   bar: 'new bar',
//   baz: ko.observable('baz')
// }
```

### Prototype Functions for Observables

###### observable.fn.increment/decrement([n = 1])

increments/decrements numeric observables.

```javascript
const foo = ko.observable(0)

foo.increment()
foo.increment(3)
foo.decrement()
foo.decrement(2)
foo()
// 1
```

###### observable.fn.subscribeOnce(fn)

Creates a subscription that is called once and then disposed.

```javascript
const foo = ko.observable(0)

foo.subscribeOnce(() => console.log('hit!'))

foo(1)
// hit!

foo(2)
// nothing...
```

###### observable.fn.toString()

Make debugging in the console much nicer; you won't ever need to actually call this.
