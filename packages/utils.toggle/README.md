# utils.toggle

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/utils.toggle
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/utils.toggle
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/utils.toggle&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/utils.toggle
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/utils.toggle&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/utils.toggle
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-utils-toggle
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-utils-toggle.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-utils-toggle&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-utils-toggle.svg?maxAge=2592000

> This package is intended for consumption via the [@profiscience/knockout-contrib] metapackage

Toggles a boolean observable

## Usage

```javascript
import { toggle } from '@profiscience/knockout-contrib'

const foo = ko.observable(true)

toggle(foo) // false
toggle(foo) // true
```
