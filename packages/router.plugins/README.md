# @profiscience/knockout-contrib-router-plugins

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

> This is a metapackage including all `@profiscience/knockout-contrib-router-plugins-*` packages

[Route Plugins](../router/docs/plugins) for [@profiscience-knockout-contrib-router](../router)

<!-- TOC -->
### Contents
- [authorization](../router.plugins.authorization)
- [children](../router.plugins.children)
- [component](../router.plugins.component)
- [components](../router.plugins.components)
- [title](../router.plugins.title)
- [with](../router.plugins.with)
<!-- /TOC -->

### Usage

All named exports from each child package (see the table of contents above) are available to import.

If using a bundler that supports tree-shaking, this will safely minify.

```javascript
// import all
import * as routerPlugins from '@profiscience/knockout-contrib-router-plugins'

// import single
import { childrenPlugin } from '@profiscience/knockout-contrib-router-plugins'
```

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/router.plugins

[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/router.plugins

[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/router.plugins

[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-router-plugins
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-router-plugins.svg

[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-router-plugins&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-router-plugins.svg?maxAge=2592000