# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [2.0.0-rc.10](https://github.com/Profiscience/knockout-contrib/compare/@profiscience/knockout-contrib-router@2.0.0-rc.9...@profiscience/knockout-contrib-router@2.0.0-rc.10) (2018-10-22)

### Bug Fixes

- **router:** Reload route when navigated to w/ different params ([b935806](https://github.com/Profiscience/knockout-contrib/commit/b935806)), closes [#142](https://github.com/Profiscience/knockout-contrib/issues/142)

# [2.0.0-rc.9](https://github.com/Profiscience/knockout-contrib/compare/@profiscience/knockout-contrib-router@2.0.0-rc.8...@profiscience/knockout-contrib-router@2.0.0-rc.9) (2018-10-19)

### Bug Fixes

- **router:** Correctly handle ambiguous routing when route appears to be the same, but isn't ([#141](https://github.com/Profiscience/knockout-contrib/issues/141)) ([6c06eb3](https://github.com/Profiscience/knockout-contrib/commit/6c06eb3))

<a name="2.0.0-rc.8"></a>

# [2.0.0-rc.8](https://github.com/Profiscience/knockout-contrib/compare/@profiscience/knockout-contrib-router@2.0.0-rc.7...@profiscience/knockout-contrib-router@2.0.0-rc.8) (2018-10-04)

**Note:** Version bump only for package @profiscience/knockout-contrib-router

<a name="2.0.0-rc.7"></a>

# [2.0.0-rc.7](https://github.com/Profiscience/knockout-contrib/compare/@profiscience/knockout-contrib-router@2.0.0-rc.6...@profiscience/knockout-contrib-router@2.0.0-rc.7) (2018-08-16)

### Bug Fixes

- **router:** Remove "sideEffects: false" from package.json ([88a0533](https://github.com/Profiscience/knockout-contrib/commit/88a0533))

<a name="2.0.0-rc.6"></a>

# [2.0.0-rc.6](https://github.com/Profiscience/knockout-contrib/compare/@profiscience/knockout-contrib-router@2.0.0-rc.5...@profiscience/knockout-contrib-router@2.0.0-rc.6) (2018-08-08)

### Bug Fixes

- **router:** Don't block navigation if same path but diff search/hash ([3af60b8](https://github.com/Profiscience/knockout-contrib/commit/3af60b8))

<a name="2.0.0-rc.5"></a>

# [2.0.0-rc.5](https://github.com/Profiscience/knockout-contrib/compare/@profiscience/knockout-contrib-router@2.0.0-rc.4...@profiscience/knockout-contrib-router@2.0.0-rc.5) (2018-08-08)

### Bug Fixes

- **router:** Prevent re-render for same-page navigation ([332154c](https://github.com/Profiscience/knockout-contrib/commit/332154c)), closes [#97](https://github.com/Profiscience/knockout-contrib/issues/97)

<a name="2.0.0-rc.4"></a>

# [2.0.0-rc.4](https://github.com/Profiscience/knockout-contrib/compare/@profiscience/knockout-contrib-router@2.0.0-rc.3...@profiscience/knockout-contrib-router@2.0.0-rc.4) (2018-07-20)

### Bug Fixes

- Add babel-runtime dep, remove unnecessary tslib dep ([9fca55a](https://github.com/Profiscience/knockout-contrib/commit/9fca55a))

### Features

- **router:** Add state option for Router.update(); Use popstate event's state on back navigation ([6eedb5d](https://github.com/Profiscience/knockout-contrib/commit/6eedb5d)), closes [#107](https://github.com/Profiscience/knockout-contrib/issues/107)


      <a name="2.0.0-rc.3"></a>

# [2.0.0-rc.3](https://github.com/Profiscience/knockout-contrib/compare/@profiscience/knockout-contrib-router@2.0.0-rc.2...@profiscience/knockout-contrib-router@2.0.0-rc.3) (2018-07-13)

**Note:** Version bump only for package @profiscience/knockout-contrib-router

<a name="2.0.0-rc.2"></a>

# [2.0.0-rc.2](https://github.com/Profiscience/knockout-contrib/compare/@profiscience/knockout-contrib-router@2.0.0-rc.0...@profiscience/knockout-contrib-router@2.0.0-rc.2) (2018-07-03)

### Reverts

- **router:** Add back support for generator/iterator middleware ([a1daf07](https://github.com/Profiscience/knockout-contrib/commit/a1daf07))

<a name="2.0.0-rc.1"></a>

# [2.0.0-rc.1](https://github.com/Profiscience/knockout-contrib/compare/@profiscience/knockout-contrib-router@2.0.0-rc.0...@profiscience/knockout-contrib-router@2.0.0-rc.1) (2018-06-29)

### Reverts

- **router:** Add back support for generator/iterator middleware ([a1daf07](https://github.com/Profiscience/knockout-contrib/commit/a1daf07))

<a name="2.0.0-rc.0"></a>

# [2.0.0-rc.0](https://github.com/Profiscience/knockout-contrib/compare/@profiscience/knockout-contrib-router@1.3.0...@profiscience/knockout-contrib-router@2.0.0-rc.0) (2018-06-28)

### Chores

- **router:** Upgrade to KnockoutJS 3.5.0-rc ([be14d20](https://github.com/Profiscience/knockout-contrib/commit/be14d20))

### Features

- **router:** Path binding partial matching ([cdd026c](https://github.com/Profiscience/knockout-contrib/commit/cdd026c)), closes [#64](https://github.com/Profiscience/knockout-contrib/issues/64)
- **router:** Use new descendantsComplete binding event to delay afterRender until all descendants c ([ccc6b74](https://github.com/Profiscience/knockout-contrib/commit/ccc6b74))

### Reverts

- **router:** Focus middleware API (remove done callback syntax and generator middleware support) ([800625c](https://github.com/Profiscience/knockout-contrib/commit/800625c))

### BREAKING CHANGES

- **router:** Removed generator middleware API and `done` callback support for async in
  middleware and beforeNavigateCallbacks
- **router:** Requires KnockoutJS 3.5.0-rc
- **router:** Require KnockoutJS 3.5.0-rc for TypeScript consumers

<a name="1.3.0"></a>

# [1.3.0](https://github.com/Profiscience/knockout-contrib/compare/@profiscience/knockout-contrib-router@2.0.0-7...@profiscience/knockout-contrib-router@1.3.0) (2018-06-28)

### Features

- **router:** Support wildcard matching for activePath binding (and path binding) ([f10f96a](https://github.com/Profiscience/knockout-contrib/commit/f10f96a))

# Changelog

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
