# router.plugins.redirect

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins.redirect
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/router.plugins.redirect
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins.redirect&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/router.plugins.redirect
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins.redirect&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/router.plugins.redirect
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-router-plugins-redirect
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-router-plugins-redirect.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-router-plugins-redirect&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-router-plugins-redirect.svg?maxAge=2592000

Support `redirect` option in route configurations.

## Usage

Redirects to the returned path, if any. Supports async via promise.

```typescript
import { Route, redirectRoutePlugin } from '@profiscience/knockout-contrib'

Route.usePlugin(redirectRoutePlugin)

function shouldRedirect(ctx) {
  // ...do something...
}

// Sync
new Route('/', {
  redirect: (ctx) => {
    if (shouldRedirect(ctx)) return '//redirect/to/this/route'
  }
})

// Async
new Route('/', {
  redirect: async (ctx) => {
    if (await shouldRedirect(ctx)) return '//redirect/to/this/route'
  }
})
```
