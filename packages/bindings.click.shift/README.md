# bindings.click.shift

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.click.shift
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/bindings.click.shift
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.click.shift&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/bindings.click.shift
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.click.shift&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/bindings.click.shift
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-bindings-click-shift
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-bindings-click-shift.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-bindings-click-shift&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-bindings-click-shift.svg?maxAge=2592000

> This package is intended for consumption via the [@profiscience/knockout-contrib][] metapackage

Built-in [click binding][], filtered for shift+click

**NOTE:** Consider mobile users (where there is no access to shift) when using this binding

## Usage

Accepts a function with the same API as the built-in [click-binding][]

```html
<div data-bind="click.shift: (event, data) => console.log(data)"></div>
```

[@profiscience/knockout-contrib]: https://github.com/Profiscience/knockout-contrib
[click binding]: https://knockoutjs.com/documentation/click-binding.html
