# utils.assign

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/utils.assign
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/utils.assign
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/utils.assign&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/utils.assign
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/utils.assign&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/utils.assign
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-utils-assign
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-utils-assign.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-utils-assign&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-utils-assign.svg?maxAge=2592000

> This package is intended for consumption via the [@profiscience/knockout-contrib] metapackage

(Deep) `Object.assign()`, but updates existing observables instead of overwriting them. Simply put, updates an observable tree by merging in new values.

## Usage

> assign(dest, src[, options = { mapArrayElements: false, strict: false }])

<pre>
For each enumerable property of src, if...
  ...value is not defined on dest and...
    ...`options.strict` is `false`, creates property as observable on `dest`
    ...`options.strict` is `true`, creates property as non-observable on `dest`
  ...value is defined and observable on `dest`
    ...`dest` observable is updated
  ...value is defined and non-observable on `dest`
    ...`dest` property is updated (not as observable)  
</pre>

If `mapArrayElements` is true, array elements will be created as mapped observables, else bare objects/primitives.
**NOTE**: Merging new arrays onto existing ones that have been mapped mapArrayElements will create new observable elements,
**not** update the existing ones. No attempts are made to key elements, nor will they. If you need more, you
probably want [ko.mapping](http://knockoutjs.com/documentation/plugins-mapping.html) which is much more powerful,
but far slower.

```javascript
import { assign } from '@profiscience/knockout-contrib'

const foos = {
  foo: ko.observable('foo'),
  bar: 'bar'
}

assign(foos, {
  foo: 'new foo',
  bar: 'new bar',
  baz: 'baz'
})
// {
//   foo: ko.observable('new foo'),
//   bar: 'new bar',
//   baz: ko.observable('baz')
// }

assign(
  foos,
  {
    foo: 'new foo',
    bar: 'new bar',
    baz: 'baz'
  },
  { strict: true }
)
// {
//   foo: ko.observable('new foo'),
//   bar: 'new bar',
//   baz: 'baz' <----------------------- When strict and observable is not pre-created on dest, property will NOT be observable
// }
```
