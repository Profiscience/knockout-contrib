# @profiscience/knockout-contrib-observable-fn-subscribe-once

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/observable.fn.subscribeOnce
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/observable.fn.subscribeOnce

[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/observable.fn.subscribeOnce&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/observable.fn.subscribeOnce

[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/observable.fn.subscribeOnce&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/observable.fn.subscribeOnce

[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-observable-fn-subscribe-once
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-observable-fn-subscribe-once.svg

[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-observable-fn-subscribe-once&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-observable-fn-subscribe-once.svg?maxAge=2592000

**NOTE:** It is recommended to use the [@profiscience/knockout-contrib-observable-fn metapackage](../observable.fn)

Creates a subscription that is called once and then disposed.

## Usage
> observable<T>.fn.subscribeOnce(fn: (newValue: T) => void)

```javascript
import '@profiscience/knockout-contrib-observable-fn/subscribeOnce'

const foo = ko.observable(0)

foo.subscribeOnce(() => console.log('hit!'))

foo(1)
// hit!

foo(2)
// nothing...
```