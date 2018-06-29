# router.plugins.components

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins.components
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/router.plugins.components
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins.components&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/router.plugins.components
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins.components&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/router.plugins.components
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-router-plugins-components
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-router-plugins-components.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-router-plugins-components&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-router-plugins-components.svg?maxAge=2592000

Register components only for the life of the page (unregister before dispose).

Allows breaking views into multiple components while helping to avoid naming conflicts.

## Usage

```typescript
import { Route, componentsRoutePlugin } from '@profiscience/knockout-contrib'

Route.usePlugin(componentsRoutePlugin)

new Route('/', {
  components: () => ({
    // will register the <toolbar></toolbar> component for use in this view and its children
    toolbar: import('./toolbar')
  })
})
```

**toolbar.ts**

```typescript
export const template = 'Hello, World!'
export class viewModel {}
```
