# router.middleware.progressBar

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.middleware.progressBar
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/router.middleware.progressBar
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.middleware.progressBar&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/router.middleware.progressBar
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.middleware.progressBar&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/router.middleware.progressBar
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-router-middleware-progress-bar
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-router-middleware-progress-bar.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-router-middleware-progress-bar&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-router-middleware-progress-bar.svg?maxAge=2592000

> **NOTE:** This package is intended for consumption via the [@profiscience/knockout-contrib metapackage](../_)

Displays a progress bar using [toprogress2][] during navigation. Accepts all toprogress2 options.

## Usage

```typescript
import {
  Router,
  createProgressBarMiddleware
} from '@profiscience/knockout-contrib'

Router.use(
  createProgressBarMiddleware({
    color: '#fff',
    height: '5px'
    // ... any toprogress2 option
  })
)
```
