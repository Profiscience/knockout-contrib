# @profiscience/knockout-contrib-bindings-shift-click

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.shiftClick
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/bindings.shiftClick

[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.shiftClick&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/bindings.shiftClick

[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.shiftClick&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/bindings.shiftClick

[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-bindings-shift-click
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-bindings-shift-click.svg

[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-bindings-shift-click&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-bindings-shift-click.svg?maxAge=2592000

**NOTE:** It is recommended to use the [@profiscience/knockout-contrib-bindings metapackage](../bindings)

Like the [click binding][], but only calls handler if shift key is pressed.

## Usage

```typescript
import '@profiscience/knockout-contrib-bindings/shiftClick'
```
```html
<div data-bind="shiftClick: handler"></div>
```

[click binding]: https://knockoutjs.com/documentation/click-binding.html