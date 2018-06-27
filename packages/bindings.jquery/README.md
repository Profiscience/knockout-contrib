# bindings.jquery

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.jquery
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/bindings.jquery
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.jquery&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/bindings.jquery
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.jquery&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/bindings.jquery
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-bindings-jquery
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-bindings-jquery.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-bindings-jquery&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-bindings-jquery.svg?maxAge=2592000

> This package is intended for consumption via the [@profiscience/knockout-contrib][] metapackage and has a peer dependency on jquery and knockout-punches

Invoke a jQuery plugin on an element

## Usage

```html
<div id="my-element" data-bind="$.somePlugin: pluginOpts"></div>
```

...is equivalent to calling `$('#my-element').somePlugin(pluginOpts)`, without having to worry about when the element is rendered.

[@profiscience/knockout-contrib]: https://github.com/Profiscience/knockout-contrib
