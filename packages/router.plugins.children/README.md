# router.plugins.children

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins.children
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/router.plugins.children
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins.children&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/router.plugins.children
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins.children&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/router.plugins.children
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-router-plugins-children
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-router-plugins-children.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-router-plugins-children&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-router-plugins-children.svg?maxAge=2592000

Idiomatically set child/nested routes

## Usage

```typescript
import {
  Route,
  childrenRoutePlugin
} from '@profiscience/knockout-contrib'

Route.usePlugin(childrenRoutePlugin)

new Route('/users', {
  children: [
    new Route('/', ...),
    new Route('/:id', ...),
    new Route('/:id/edit', ...)
  ]
})
```

Object-shorthand _is_ supported, but it should only be used to migrate legacy routes as it requires casting as any (with TypeScript).
This is due to the fact that in order to support object shorthand (which uses keys as the route names, meaning they are dynamic), and
index signature must be added, and in doing so the strictness of the typechecking (and thus the usefulness) is greatly diminished when
using the (preferred) route constructor syntax. But alas... here it is.

```typescript
new Route('/users', {
  children: {
    '/': ...,
    '/:id': ...,
    '/:id/edit': ...
  } as any // <----- If you're using TS, you HAVE to do this, or it will not compile
})
```
