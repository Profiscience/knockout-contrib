# router.middleware.loading

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.middleware.loading
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/router.middleware.loading
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.middleware.loading&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/router.middleware.loading
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.middleware.loading&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/router.middleware.loading
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-router-middleware-loading
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-router-middleware-loading.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-router-middleware-loading&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-router-middleware-loading.svg?maxAge=2592000

> **NOTE:** This package is intended for consumption via the [@profiscience/knockout-contrib metapackage](../_)

Eases creation of loading middlware

## Usage

```typescript
import { Router, createLoadingMiddleware } from '@profiscience/knockout-contrib'

Router.use(
  createLoadingMiddleware({
    start() {
      showLoader()
    },
    end() {
      hideLoader()
    },

    /* OPTIONAL */
    minDuration: 0 // prevent flickering on fast navigation (show loader for at least <n> ms)
  })
)
```
