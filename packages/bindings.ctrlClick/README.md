# @profiscience/knockout-contrib-bindings-ctrl-click

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.ctrlClick
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/bindings.ctrlClick

[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.ctrlClick&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/bindings.ctrlClick

[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.ctrlClick&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/bindings.ctrlClick

[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-bindings-ctrl-click
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-bindings-ctrl-click.svg

[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-bindings-ctrl-click&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-bindings-ctrl-click.svg?maxAge=2592000

Built-in [click binding][], filtered for ctrl+click

__NOTE:__ Consider MacOS (where meta+click is more intuitive) and mobile users (where there is no access to ctrl) when using this binding

## Usage

```typescript
// register as "ctrlClick"
import '@profiscience/knockout-contrib-bindings-ctrl-click'

// register as custom name
import * as ko from 'knockout'
import { ctrlClickBindingHandler } from '@profiscience/knockout-contrib-bindings-ctrl-click'
ko.bindingHandlers['click.ctrl'] = ctrlClickBindingHandler
```

```html
<div data-bind="ctrlClick: (event, data) => console.log(data)"></div>
```

[click binding]: https://knockoutjs.com/documentation/click-binding.html