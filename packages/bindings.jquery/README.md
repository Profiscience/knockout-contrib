# @profiscience/knockout-contrib-bindings-jquery

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

<!-- **NOTE:** It is recommended to use the [@profiscience/knockout-contrib-utils metapackage](../utils) -->

Invoke a jQuery plugin on an element

This binding depends on jquery and namespaced bindings from knockout-punches.

## Usage

```typescript
import '@profiscience/knockout-contrib-bindings-jquery'
```
```html
<div data-bind="$.somePlugin: pluginOpts"></div>
```