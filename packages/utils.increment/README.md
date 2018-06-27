# utils.increment / utils.decrement

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/utils.increment
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/utils.increment
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/utils.increment&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/utils.increment
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/utils.increment&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/utils.increment
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-utils-increment
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-utils-increment.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-utils-increment&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-utils-increment.svg?maxAge=2592000

> This package is intended for consumption via the [@profiscience/knockout-contrib] metapackage.

Increments/decrements a numeric observable. Returns the new value.

## Usage

```javascript
import { increment, decrement } from '@profiscience/knockout-contrib'

const foo = ko.observable(0)

increment(foo) // 1
increment(foo, 3) // 4
decrement(foo) // 3
decrement(foo, 2) // 1
```
