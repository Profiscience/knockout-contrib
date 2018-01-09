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

- Register the plugin
- Create your `Authorization` classes which implement the `IAuthorization` interface
- Profit.

```typescript
import { Route } from '@profiscience/knockout-contrib-router'
import { IAuthorization, createAuthorizationPlugin } from '@profiscience/knockout-contrib-router-plugins'
import { getCurrentUser } from './lib'

Route.usePlugin(createAuthorizationPlugin({
  isAdmin: false,
  notAuthorizedRedirectPath: '/400'
}))

class RoleAuthorization implements IAuthorization {
  // this will be used to set the flash message if using the flash message middleware
  public notAuthorizedMessage = `You must have the ${this.role} role to access this page`

  constructor(public role: string) {}

  // may be async via promises
  public authorized(ctx: Context & IContext) {
    return getCurrentUser().roles.indexOf(this.role) > -1
  }
}

// basic usage, pass an array of the required authorizations. if not authorized, will redirect to the
// globally configured notAuthorizedRedirectPath
new Route('/', {
  authorize: [
    new RoleAuthorization('MANAGER')
  ]
})

// optionally supply a redirect path different from the globally configured value
new Route('/', {
  authorize: {
    authorizations: [new RoleAuthorization('MANAGER')],
    notAuthorizedRedirectPath: '/not-authorized' 
  }
})

// notAuthorizedRedirectPath may also be an accessor function and accepting the context as the first and only argument.
// may return a promise
new Route('/:id/edit', {
  authorize: {
    authorizations: [new RoleAuthorization('MANAGER')],
    notAuthorizedRedirectPath: (ctx: Context & IContext) => `/user/${ctx.params.id}`
  }
})
```