# @profiscience/knockout-contrib-router-plugins-title

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins.title
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/router.plugins.title

[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins.title&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/router.plugins.title

[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins.title&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/router.plugins.title

[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-router-plugins-title
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-router-plugins-title.svg

[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-router-plugins-title&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-router-plugins-title.svg?maxAge=2592000

**NOTE:** It is recommended to use the [@profiscience/knockout-contrib-router-plugins metapackage](../router.plugins)

@TODO description

## Usage

```typescript
import { Route } from '@profiscience/knockout-contrib-router'
import { titlePlugin } from '@profiscience/knockout-contrib-router-plugins'

Route.usePlugin(titlePlugin)

new Route('/', {
  title: '@TODO'
})
```