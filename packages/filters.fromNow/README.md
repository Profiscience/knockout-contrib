# @profiscience/knockout-contrib-filters-from-now

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/filters.fromNow
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/filters.fromNow

[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/filters.fromNow&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/filters.fromNow

[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/filters.fromNow&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/filters.fromNow

[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-filters-from-now
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-filters-from-now.svg

[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-filters-from-now&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-filters-from-now.svg?maxAge=2592000

<!-- **NOTE:** It is recommended to use the [@profiscience/knockout-contrib-utils metapackage](../utils) -->

Display relative times for a date object

This filter depends on filters from knockout-punches. Uses [s-ago][] for relative datetimes, with support added for future dates.

## Usage

```typescript
import '@profiscience/knockout-contrib-filters-from-now'
```
```html
<span data-bind="text: someTime | fromNow"></span>
```

[s-ago]: https://github.com/sebastiansandqvist/s-ago