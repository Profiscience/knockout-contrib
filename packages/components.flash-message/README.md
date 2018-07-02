# components.flash-message

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/components.flash-message
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/components.flash-message
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/components.flash-message&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/components.flash-message
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/components.flash-message&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/components.flash-message
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-components-flash-message
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-components-flash-message.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-components-flash-message&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-components-flash-message.svg?maxAge=2592000

> **NOTE:** This packages is intended for consumption via the [@profiscience/knockout-contrib metapackage](../_)

Flash message component for use with [@profiscience/knockout-contrib-router-middleware-flash-message](../router.middleware.flashMessage).

## Usage

```typescript
import * as ko from 'knockout'
import { flashMessageComponentConfig } from '@profiscience/knockout-contrib'

ko.components.register('contrib-flash-message', flashMessageComponentConfig)
```

```html
<contrib-flash-message></contrib-flash-message>
```
