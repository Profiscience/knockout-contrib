# bindings.toggle

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.toggle
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/bindings.toggle
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.toggle&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/bindings.toggle
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.toggle&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/bindings.toggle
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-bindings-toggle
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-bindings-toggle.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-bindings-toggle&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-bindings-toggle.svg?maxAge=2592000

> This package is intended for consumption via the [@profiscience/knockout-contrib][] metapackage

Toggle an observable boolean on click. Disable with optional `toggleDisable` binding.

## Usage

```html
<div data-bind="toggle: myObsBool, toggleDisable: ko.observable(false)"></div>
```

[@profiscience/knockout-contrib]: https://github.com/Profiscience/knockout-contrib
