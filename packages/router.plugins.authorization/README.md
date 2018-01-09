# @profiscience/knockout-contrib-router-plugins-authorization

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins.authorization
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/router.plugins.authorization

[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins.authorization&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/router.plugins.authorization

[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins.authorization&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/router.plugins.authorization

[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-router-plugins-authorization
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-router-plugins-authorization.svg

[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-router-plugins-authorization&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-router-plugins-authorization.svg?maxAge=2592000

**NOTE:** It is recommended to use the [@profiscience/knockout-contrib-router-plugins metapackage](../router.plugins)

Prevent unauthorized access to a route.

## Usage

```typescript
import { Route } from '@profiscience/knockout-contrib-router'
import { IAuthorization, authorizationPlugin } from '@profiscience/knockout-contrib-router-plugins'
import { getCurrentUser } from './lib'

Route.usePlugin(authorizationPlugin)

class RoleAuthorization implements IAuthorization {
  public notAuthorizedMessage = `You must have the ${this.role} role to access this page`

  constructor(public role: string) {}

  public authorized() {
    return getCurrentUser().roles.indexOf(this.role) > -1
  }
}

new Route('/', {
  authorize: [
    new RoleAuthorization('MANAGER')
  ]
})
```