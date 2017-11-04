# @profiscience/knockout-contrib-utils-from-js

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/utils.fromJS
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/utils.fromJS

[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/utils.fromJS&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/utils.fromJS&type=peer

[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/utils.fromJS&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/utils.fromJS&type=dev

[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-utils-from-js
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-utils-from-js.svg

[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-utils-from-js&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-utils-from-js.svg?maxAge=2592000

**NOTE:** It is recommended to use the [@profiscience/knockout-contrib-utils metapackage](../utils)

## Usage
> fromJS(src[, mapArrays = false])

Creates a tree of observables from `src`.

If `mapArrays` is true, array elements will be created as mapped observables, else bare objects/primitives.

The much needed inverse to the undocumented `ko.toJS` function; a dumb version of [ko.mapping.fromJS](http://knockoutjs.com/documentation/plugins-mapping.html)
that is a lot faster.

```javascript
import { fromJS } from '@profiscience/knockout-contrib-utils'

const foos = {
  foo: 'foo',
  bar: {
    baz: 'baz',
    qux: ['qux']
  }
}

fromJS(foos, true)
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