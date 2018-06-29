# router.plugins.with

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

Allows extending the context for a route with arbitrary data

## Usage

```typescript
import { Route, withRoutePlugin } from '@profiscience/knockout-contrib'

Route.usePlugin(withRoutePlugin)

// Sync
new Route('/', {
  with: {
    myAdditionalProp: true
  }
})

// Accessor
new Route('/', {
  with: (ctx) => {
    // synchronous
    return {
      myAdditionalProp: true
    }

    // async via promises
    return Promise.resolve({
      myAdditionalProp: true
    })
  }
})
```

Now, in the viewModel (as well as any subsequent middleware), `ctx.myAdditionalProp` will be `true`.

**NOTE:** If you're using TypeScript, it's worth noting that the return type _is strongly typed_. The properties it adds _must_
be defined on the IContext interface, _or_ cast as `any`.

e.g.

```typescript
declare module '@profiscience/knockout-contrib-router' {
  interface IContext {
    myAdditionalProp?: boolean
  }
}

// ...or...

new Route('/', {
  with: {
    myAdditionalProp: true
  } as any
})
```
