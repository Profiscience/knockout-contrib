# utils.fromJS

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/utils.fromJS
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/utils.fromJS
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/utils.fromJS&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/utils.fromJS
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/utils.fromJS&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/utils.fromJS
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-utils-from-js
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-utils-from-js.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-utils-from-js&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-utils-from-js.svg?maxAge=2592000

> This package is intended for consumption via the [@profiscience/knockout-contrib] metapackage

## Usage

> fromJS(src[, mapArrayElements = false])

Creates a tree of observables from `src`.

If `mapArrayElements` is true, array elements will be passed to `fromJS` as well, else bare objects/primitives.

The much needed inverse to the undocumented `ko.toJS` function; a dumb version of [ko.mapping.fromJS](http://knockoutjs.com/documentation/plugins-mapping.html) that is [_a lot faster_](#benchmark).

```javascript
import { fromJS } from '@profiscience/knockout-contrib'

const foos = {
  foo: 'foo',
  bar: {
    baz: 'baz',
    qux: ['qux']
  }
}

fromJS(foos)
// {
//   foo: ko.observable('foo'),
//   bar: {
//     baz: ko.observable('baz'),
//     qux: ko.observableArray([
//       'qux'
//     ])
//   }
// }

fromJS(foos, true)
// {
//   foo: ko.observable('foo'),
//   bar: {
//     baz: ko.observable('baz'),
//     qux: ko.observableArray([
//       ko.observable('qux') <--------- Array contents mapped when second argument is true
//     ])
//   }
// }
```

## Benchmark

```shell
$ ./benchmark.ts
utils.fromJS                    x 316,313 ops/sec ±3.37% (79 runs sampled)
utils.fromJS (mapArrayElements) x 151,401 ops/sec ±3.24% (81 runs sampled)
mapping.fromJS                  x 11,995 ops/sec ±3.82% (81 runs sampled)
```
