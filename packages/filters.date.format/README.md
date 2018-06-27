# filters.date.format

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/filters.date.format
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/filters.date.format
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/filters.date.format&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/filters.date.format
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/filters.date.format&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/filters.date.format
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-filters-date-format
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-filters-date-format.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-filters-date-format&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-filters-date-format.svg?maxAge=2592000

> This packages is intended for consumption via the [@profiscience/knockout-contrib][] metapackage

Formats a date using [date-fn's format function][date-fns-format]

## Usage

See the documentation for [format][date-fns-format] from date-fns for date formatting string options

```html
<span data-bind="text: new Date() | date.format:'YYYY-MM-DD'"></span>
```

[@profiscience/knockout-contrib]: https://github.com/Profiscience/knockout-contrib
[date-fns-format]: https://date-fns.org/v1.29.0/docs/format
