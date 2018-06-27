# utils.once

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/utils.once
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/utils.once
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/utils.once&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/utils.once
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/utils.once&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/utils.once
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-utils-once
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-utils-once.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-utils-once&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-utils-once.svg?maxAge=2592000

> This package is intended for consumption via the [@profiscience/knockout-contrib] metapackage

Creates a subscription that is called once and then disposed. Returns subscription for early disposal if necessary.

## Usage

```javascript
import { once } from '@profiscience/knockout-contrib'

const foo = ko.observable(0)

const sub = once(foo, () => console.log('hit!'))

foo(1)
// hit!

foo(2)
// nothing...
```
