# Changelog

## next

Minor breaking changes due to required new features introduced in Knockout 3.5.0-beta.

This release will move out of beta when Knockout 3.5 does.

For now it is published as `next`

### Changed
- [**BREAKING**] Upgrade [Knockout 3.5.0-beta][] peer dependency


### Added
- Delay navigation complete until `descendantsComplete` (see [Knockout 3.5.0-beta][], [Knockout #2319][])

### Fixed
- Static `Router.isNavigating` shouldn't throw if read before initialization
- Use strict TypeScript checking (this is relevant if you use TypeScript with strict to consume, as the types declaration points to the source)


[Knockout 3.5.0-beta]: https://github.com/knockout/knockout/releases/tag/v3.5.0-beta
[Knockout #2319]: https://github.com/knockout/knockout/pull/2319

---

## 1.2.0

### Added
- Static `Router.isNavigating` observable for determining if any routers are navigating

### Changed
- Clear `history.state` on Router.update, unless `push: false`


## 1.1.0

### Added
- `router.depth` property
- Can now create and register route instances directly
- All Middleware types are now exported (SimpleMiddleware, LifecycleObjectMiddleware, GeneratorMiddleware)

### Removed
- NormalizedRouteConfig type
- NormalizedRouteMap type

### Changed
- `Router.usePlugin()` moved to `Route.usePlugin`

### Internal
- When using object shorthand, routes are initialized on registration instead of initialization


## 1.0.0 (ko-component-router => @profiscience/knockout-contrib-router)

### Changed
- Convert to monorepo
- Rename router component to `router`
- Import is now `@profiscience/knockout-contrib-router`
- `ko-component-router-view` class changed to `router-view`
- Support chaining on router — `Router.setConfig(...).use(...).use(...).useRoutes(...)`

### Added
- Began work on first-class TypeScript support (`noImplicitAny`, introduce `IContext`)
- `activePath` binding for applying a class to an element when a path is active
- `ctx.element` for accessing the routed view container

### Fixed
- Support transpiled (async) generator middleware

### Internal
- Migrated build system from Fly to Taskr
- Migrated from Coveralls to Codecov

---

**FROM https://github.com/Profiscience/ko-component-router**

## 5.0.1

### Fixed
 - Incorrect tslib dependency


## 5.0.0

### Changed
 - Improved nested routing UX ([Building a Better Router](https://medium.com/@notCaseyWebb/building-a-better-router-ef42896e2e5a))

### Removed
 - Ability to pass routes as component parameters to nested routers


## 4.4.4

### Fixed
 - deeply nested child afterDispose middleware not being called


## 4.4.3

### Fixed
 - querystring and hash being wiped out in child routes on popstate
 - child afterDispose middleware not being called


## 4.4.2

### Fixed
 - Navigating to same route w/ different params caused issues w/ middleware execution order — #164


## 4.4.1

### Added
 - examples! :beers:

### Fixed
 - Basepath not working correctly with hashbang (appended instead of prepended) — #156
 - Landing on `/` in hashbang mode did not redirect to `/#!/`


## 4.4.0

### Added
 - Router.initialized

### Fixed
 - afterRender middleware in child routers being ran twice
 - path binding not usable from <ko-component-router> parent component when wrapped — #157


## 4.3.1

### Fixed
 - Navigating to url w/ query or hash wiped out said query or hash


## 4.3.0

### Added
 - Router.setConfig
 - Router.useRoutes
 - router.$parents
 - ctx.$parents
 - router.$children
 - ctx.$children

### Fixed
 - Options to router.update were not being passed down to children when applicable
 - Child afterRender middleware was not being ran when parent navigated away


## 4.2.0

### Added
  - `with` option for router.update


## 4.1.0

### Added
 - Router.head and Router.tail accessors


## 4.0.1

### Changed
 - Middleware execution order; beforeRender middleware is now called _before_
 preceding page's afterRender, preventing a blank page while async middleware is
 executing

### Fixed
 - IE9-11 pathname parsing [#132](https://github.com/Profiscience/ko-component-router/pull/132)


## 4.0.0
See [Migrating from 3.x to 4.x](https://github.com/Profiscience/ko-component-router/wiki/Migrating-from-3.x-to-4.x)