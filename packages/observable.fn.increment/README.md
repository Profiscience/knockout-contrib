# @profiscience/knockout-contrib-observable-fn-increment

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/observable.fn.increment
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/observable.fn.increment

[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/observable.fn.increment&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/observable.fn.increment&type=peer

[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/observable.fn.increment&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/observable.fn.increment&type=dev

[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-observable-fn-increment
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-observable-fn-increment.svg

[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-observable-fn-increment&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-observable-fn-increment.svg?maxAge=2592000

**NOTE:** It is recommended to use the [@profiscience/knockout-contrib-observable-fn metapackage](../observable.fn)

Increments/decrements numeric observables

## Usage

```javascript
import '@profiscience/knockout-contrib-observable-fn/increment'

const foo = ko.observable(0)

foo.increment()   // 1
foo.increment(3)  // 4
foo.decrement()   // 3
foo.decrement(2)  // 1
```