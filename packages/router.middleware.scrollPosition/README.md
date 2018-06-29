# router.middleware.scrollPosition

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.middleware.scrollPosition
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/router.middleware.scrollPosition
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.middleware.scrollPosition&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/router.middleware.scrollPosition
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.middleware.scrollPosition&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/router.middleware.scrollPosition
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-router-middleware-scroll-position
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-router-middleware-scroll-position.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-router-middleware-scroll-position&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-router-middleware-scroll-position.svg?maxAge=2592000

Add support for:

- restoring scroll position on back-button navigation
- scrolling to anchors (#hash), or the top on forward navigation

## Usage

```typescript
import {
  Router,
  createScrollPositionMiddleware
} from '@profiscience/knockout-contrib'

Router.use(
  createScrollPositionMiddleware({
    // optionally supply a custom scroll function (add smooth scrolling, use Velocity, etc.)
    scrollTo(x, y) { ... }
  })
)
```
