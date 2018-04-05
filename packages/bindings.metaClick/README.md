# @profiscience/knockout-contrib-bindings-meta-click

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.metaClick
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/bindings.metaClick

[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.metaClick&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/bindings.metaClick

[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.metaClick&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/bindings.metaClick

[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-bindings-meta-click
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-bindings-meta-click.svg

[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-bindings-meta-click&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-bindings-meta-click.svg?maxAge=2592000

Built-in [click binding][], filtered for meta+click

__NOTE:__ Consider mobile users (where there is no access to meta) when using this binding

## Usage

```typescript
// register as "metaClick"
import '@profiscience/knockout-contrib-bindings-meta-click'

// register as custom name
import * as ko from 'knockout'
import { metaClickBindingHandler } from '@profiscience/knockout-contrib-bindings-meta-click'
ko.bindingHandlers['click.meta'] = metaClickBindingHandler
```

```html
<div data-bind="metaClick: (event, data) => console.log(data)"></div>
```

[click binding]: https://knockoutjs.com/documentation/click-binding.html