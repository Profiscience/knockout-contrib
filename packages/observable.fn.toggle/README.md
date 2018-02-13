# @profiscience/knockout-contrib-observable-fn-toggle

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/observable.fn.toggle
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/observable.fn.toggle

[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/observable.fn.toggle&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/observable.fn.toggle

[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/observable.fn.toggle&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/observable.fn.toggle

[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-observable-fn-toggle
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-observable-fn-toggle.svg

[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-observable-fn-toggle&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-observable-fn-toggle.svg?maxAge=2592000

**NOTE:** It is recommended to use the [@profiscience/knockout-contrib-observable-fn metapackage](../observable.fn)

toggles/decrements numeric observables

## Usage

```javascript
import '@profiscience/knockout-contrib-observable-fn/toggle'

const foo = ko.observable(true)

foo.toggle()  // false
foo.toggle()  // true
```