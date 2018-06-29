# utils.defaults

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/utils.defaults
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/utils.defaults
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/utils.defaults&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/utils.defaults
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/utils.defaults&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/utils.defaults
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-utils-defaults
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-utils-defaults.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-utils-defaults&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-utils-defaults.svg?maxAge=2592000

> This package is intended for consumption via the [@profiscience/knockout-contrib] metapackage

## Usage

> defaults(dest, defaultValues[, mapArrays = false])

Creates observables for enumerable properties of `defaultValues` where undefined in the destination object.

If `mapArrayElements` is true, array elements will be created using [utils.fromJS](../utils.fromJS).

```javascript
import { defaults } from '@profiscience/knockout-contrib'

const foos = { foo: 'foo' }
defaults(foos, { foo: 'bar', bar: 'bar' })

foos()
// { foo: 'foo', bar: 'bar' }
```
