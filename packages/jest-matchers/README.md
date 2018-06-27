# jest-matchers

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

Matchers for testing KnockoutJS with [jest][]

# API

- `toBeObservable()`

# Usage

_This package is **NOT** included in the metapackage. Install it with `yarn add @profiscience/knockout-contrib-jest-matches`, or the equivalent for your package manager (npm, pnpm, etc.)._

```javascript
import '@profiscience/knockout-contrib-jest-matchers'

expect(ko.observable(true)).toBeObservable()
```

[jest]: https://facebook.github.io/jest/
[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/jest-matchers
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/jest-matchers
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/jest-matchers&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/jest-matchers
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/jest-matchers&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/jest-matchers
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-jest-matchers
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-jest-matchers.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-jest-matchers&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-jest-matchers.svg?maxAge=2592000
