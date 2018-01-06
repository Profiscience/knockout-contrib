# @profiscience/knockout-contrib-router-plugins-with

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins.with
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/router.plugins.with

[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins.with&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/router.plugins.with

[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins.with&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/router.plugins.with

[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-router-plugins-with
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-router-plugins-with.svg

[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-router-plugins-with&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-router-plugins-with.svg?maxAge=2592000

**NOTE:** It is recommended to use the [@profiscience/knockout-contrib-router-plugins metapackage](../router.plugins)

@TODO description

## Usage

```typescript
import { Route } from '@profiscience/knockout-contrib-router'
import { withPlugin } from '@profiscience/knockout-contrib-router-plugins'

Route.usePlugin(withPlugin)

new Route('/', {
  with: '@TODO'
})
```