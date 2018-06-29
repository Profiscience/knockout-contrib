# Router

_ES2015_

```javascript
import { Router } from '@profiscience/knockout-contrib'
```

_CommonJS_

```javascript
const { Router } = require('@profiscience/knockout-contrib')
```

_Browser Globals_

```javascript
const { Router } = ko.router
```

## API

### Instance

#### router.ctx

Current [router context](./context.md) object

#### router.initialized

Promise that returns after this router is initialized

#### router.depth

Depth of this router; accessor for `router.ctx.$parents.length`

#### router.isNavigating()

Observable value that is true if router is navigating

#### router.isRoot

Is the root router

#### router.update(path, [push = true], [options = { push: true, force: false, with: {} }])

Routes to `path`; adds history state entry if `push === true`

Second argument can be a boolean `push`, or an options object:

| Option | Description                   | Default |
| ------ | ----------------------------- | ------- |
| push   | push history state entry      | true    |
| force  | force reload of same route    | false   |
| with   | object to extend context with | {}      |

### Static

#### Router.get(index)

Return router at the given depth, beginning at 0

#### Router.head

Top-most router

#### Router.initialized

Alias for `Router.head.initialized`

#### Router.isNavigating()

Observable value which is true if _any_ routers are navigating, including nested routers

#### Router.setConfig({ base = '', hashbang = false, activePathCSSClass = 'active-path' })

Sets router configuration

#### Router.use(...fns)

Registers app [middleware](./middleware.md)

#### Router.usePlugin(...fns) [deprecated]

Registers [plugin](./plugins.md). Use `Route.usePlugin` instead.

Plugins must be registered _before_ routes

#### Router.useRoutes(routes)

Registers routes

**NOTE:** `setConfig` and the `use` methods may be chained, e.g.

```typescript
Router.setConfig(routerConfig)

  .use(someMiddleware)
  .use(anotherMiddleware)

  .usePlugin(somePlugin)
  .useRoutes(homeRoutes)
  .useRoutes(profileRoutes)
```

#### Router.update(path, [push = true], [options = { push: true, force: false, with: {} }])

Convenience function for `Router.get(0).update(...)`

---

[Back](./README.md)
