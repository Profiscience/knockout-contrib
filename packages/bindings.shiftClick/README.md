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

Built-in [click binding][], filtered for shift+click

__NOTE:__ Consider mobile users (where there is no access to shift) when using this binding

## Usage

```typescript
// register as "shiftClick"
import '@profiscience/knockout-contrib-bindings-shift-click'

// register as custom name
import * as ko from 'knockout'
import { shiftClickBindingHandler } from '@profiscience/knockout-contrib-bindings-shift-click'
ko.bindingHandlers['click.shift'] = shiftClickBindingHandler
```

```html
<div data-bind="shiftClick: (event, data) => console.log(data)"></div>
```

[click binding]: https://knockoutjs.com/documentation/click-binding.html