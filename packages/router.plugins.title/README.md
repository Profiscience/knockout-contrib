# router.plugins.title

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

Set `document.title` for a route. Supports nesting/composition.

## Usage

```typescript
import { Route, createTitleRoutePlugin } from '@profiscience/knockout-contrib'

Route.usePlugin(createTitleRoutePlugin())

// Basic
new Route('/', {
  title: 'Home'
})

// Sync Accessor Function
new Route('/profile', [loadUser], {
  title: (ctx) => `Profile | ${ctx.user.name}`
})

// Async Accessor Function
new Route('/profile', {
  title: async (ctx) => `Profile | ${await getUserName()}`
})
```

### Nested Routing

If you have nested routes that both supply a title, by default they will be joined with "|"...

```typescript
new Route('/', {
  title: 'My Awesome App',
  children: [
    new Route('/', {
      title: 'Home'
    }),
    new Route('/profile', {
      title: 'Profile'
    })
  ]
})
```

If you land on `/` the title will be set to "My Awesome App | Home"; likewise navigating to `/profile` will update the title to "My Awesome App | Profile".

### Using a Custom Formatter

If you'd like to using something other than "|" to join your routes, you may pass a custom formatter function to `createTitleRoutePlugin`.

```typescript
Route.usePlugin(
  createTitleRoutePlugin((ts: string[]) => `My Awesome App | ${ts.join(' > ')}`)
)
```
