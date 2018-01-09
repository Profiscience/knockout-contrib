# @profiscience/knockout-contrib-router-middleware-{{kebabCase name}}

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.middleware.{{camelCase name}}
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/router.middleware.{{camelCase name}}

[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.middleware.{{camelCase name}}&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/router.middleware.{{camelCase name}}

[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.middleware.{{camelCase name}}&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/router.middleware.{{camelCase name}}

[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-router-middleware-{{kebabCase name}}
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-router-middleware-{{kebabCase name}}.svg

[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-router-middleware-{{kebabCase name}}&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-router-middleware-{{kebabCase name}}.svg?maxAge=2592000

**NOTE:** It is recommended to use the [@profiscience/knockout-contrib-router-middleware metapackage](../router.middleware)

@TODO

## Usage

```typescript
import { Router } from '@profiscience/knockout-contrib-router'
import { {{camelCase name}}Middleware } from '@profiscience/knockout-contrib-router-middleware'

Router.use({{camelCase name}}Middleware)
```