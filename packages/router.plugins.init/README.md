# router.plugins.init

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins.init
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/router.plugins.init
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins.init&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/router.plugins.init
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins.init&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/router.plugins.init
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-router-plugins-init
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-router-plugins-init.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-router-plugins-init&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-router-plugins-init.svg?maxAge=2592000

Works with [router.plugins.component](../router.plugins.component) to declaratively initialize a viewModel before rendering.

## Usage

- Register the plugin _after_ [router.plugins.component](../router.plugins.component) (alternatively, use your own plugin/middleware to attach the viewModel instance to `ctx.component.viewModel`)
- Attach a promise to your viewModel (or any property of your viewModel) using the exported `INITIALIZED` [Symbol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- Profit :moneybag:

```typescript
import {
  Route,
  componentRoutePlugin,
  componentInitializerRoutePlugin,
  INITIALIZED
} from '@profiscience/knockout-contrib'

Route.usePlugin(componentRoutePlugin).usePlugin(componentInitializerRoutePlugin) // **MUST** come after component plugin

class DataModel {
  public [INITIALIZED] = this.init()

  public async init() {
    /* do some async init stuff */
  }
}

class ViewModel {
  /**
   * Attach directly to the viewModel...
   */
  public [INITIALIZED] = this.init()

  /**
   * ...or any enumerable property
   */
  public data = new DataModel()

  async init() {
    /* do some async init stuff */
  }
}
```

### What's with the symbol?

Prevents naming conflicts. The alternative is to use a "magic" property, like `initialized`, but that would
a) prevent you from using your _own_ `initialized` property/method in your viewModel (which is something you'll probably want at one point or another)
b) make it difficult for developers unaware of the use of this plugin to track down issues or figure out where the magic is happening (explicit imports lead to discoverability)
