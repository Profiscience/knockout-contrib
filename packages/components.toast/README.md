# @profiscience/knockout-contrib-components-toast

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/components.toast
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/components.toast

[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/components.toast&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/components.toast

[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/components.toast&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/components.toast

[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-components-toast
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-components-toast.svg

[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-components-toast&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-components-toast.svg?maxAge=2592000

<!-- **NOTE:** It is recommended to use the [@profiscience/knockout-contrib-utils metapackage](../utils) -->

Display a toast notification.

## Usage

#### Initialization

In the root of your app, import the component to register it, and include in your root template.

```typescript
import '@profiscience/knockout-contrib-components-toast'
```
```html
<knockout-contrib-toast></knockout-contrib-toast>
```

#### Invoking
```typescript
import Toast from '@profiscience/knockout-contrib-components-toast'

Toast.success('Gucci Mane')
```