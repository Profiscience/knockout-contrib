# bindings.repeat

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.repeat
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/bindings.repeat
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.repeat&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/bindings.repeat
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.repeat&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/bindings.repeat
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-bindings-repeat
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-bindings-repeat.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-bindings-repeat&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-bindings-repeat.svg?maxAge=2592000

> This package is intended for consumption via the [@profiscience/knockout-contrib][] metapackage

Repeat a template `n` times

## Usage

```html
<ol data-bind="repeat: 5">
  <li data-bind="text: $index()"></li>
</ol>
```

[@profiscience/knockout-contrib]: https://github.com/Profiscience/knockout-contrib
