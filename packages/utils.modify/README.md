# utils.modify

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/utils.modify
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/utils.modify
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/utils.modify&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/utils.modify
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/utils.modify&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/utils.modify
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-utils-modify
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-utils-modify.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-utils-modify&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-utils-modify.svg?maxAge=2592000

> This package is intended for consumption via the [@profiscience/knockout-contrib] metapackage

Modifies an observable using a transform function. Returns the new value.

Useful for wrapping general purpose utilities functions for Knockout observables.

## Usage

```javascript
import { modify } from '@profiscience/knockout-contrib'

const foobar = ko.observable('foobar')

function reverseString(str) {
  return str
    .split('')
    .reverse()
    .join('')
}

const ret = modify(foobar, reverseString)
;(foobar() === ret) === 'raboof'
```
