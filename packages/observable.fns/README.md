# ko-contrib-fns

[![NPM Version](https://img.shields.io/npm/v/ko-contrib-fns.svg)](https://www.npmjs.com/package/ko-contrib-fns)
![WTFPL](https://img.shields.io/npm/l/ko-contrib-fns.svg)
[![Travis](https://img.shields.io/travis/Profiscience/ko-contrib-fns.svg)](https://travis-ci.org/Profiscience/ko-contrib-fns)
[![Coverage Status](https://coveralls.io/repos/github/Profiscience/ko-contrib-fns/badge.svg?branch=master)](https://coveralls.io/github/Profiscience/ko-contrib-fns?branch=master)
[![Dependency Status](https://img.shields.io/david/Profiscience/ko-contrib-fns.svg)](https://david-dm.org/Profiscience/ko-contrib-fns)
[![Peer Dependency Status](https://img.shields.io/david/peer/Profiscience/ko-contrib-fns.svg?maxAge=2592000)](https://david-dm.org/Profiscience/ko-contrib-fns#info=peerDependencies&view=table)

### Table of Contents
- [ko.observable.fn.increment/decrement](#observablefnincrementdecrementn--1)  
- [ko.observable.fn.subscribeOnce](#observablefnsubscribeoncefn)
- [ko.observable.fn.toString](#observablefntostring)

###### observable.fn.increment/decrement([n = 1])

increments/decrements numeric observables.

```javascript
import 'ko-contrib-fns/increment'

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
import 'ko-contrib-fns/subscribeOnce'

const foo = ko.observable(0)

foo.subscribeOnce(() => console.log('hit!'))

foo(1)
// hit!

foo(2)
// nothing...
```

###### observable.fn.toString()

Make debugging in the console much nicer; you won't ever need to actually call this.

```javascript
import 'ko-contrib-fns/toString'
```
