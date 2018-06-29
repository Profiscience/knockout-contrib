# @profiscience/knockout-contrib

[![KnockoutJS][knockout-shield]][knockoutjs]
[![Build Status][travis-ci-shield]][travis-ci]
[![Coverage States][codecov-shield]][codecov]
[![Gitter][gitter-shield]][gitter]

[Metapackage][] containing all of the goodies from the [@profiscience/knockout-contrib][] monorepo. Everything you need to start building SPAs with KnockoutJS. Some bits are more opinionated than others, use however much/little as makes sense for your project. Publishing everything together as a metapackage is intended to a) reduce typing and b) increase discoverability.

## Installation / Usage

First, install the metapackage. This will install the latest version of each package in [@profiscience/knockout-contrib][].

```bash
yarn add @profiscience/knockout-contrib
```

Then somewhere in your app _before_ you kick off `ko.applyBindings()`, add the following boilerplate code...

> **NOTE:** Nothing will be added to the global scope, nor any Knockout registries modified simply by installing/importing this package. You _must_ register any bindings, components, filters, or router middleware/plugins you wish to use. This allows you to use your own loading mechanism, naming schemes, etc. if you so choose, as well as keeping each package pure (exports only, no global scope modification), enabling tree-shake-ability with webpack, rollup, or the esm bundler du jor.

```typescript
/**
 * Copy this to your project, and remove any bits you don't need/want.
 *
 * **Don't'** change the knockout-contrib import statement to an `import *`
 * if you remove anything, otherwise you will not be able to take advantage of
 * tree-shaking.
 */

import * as ko from 'knockout'
import 'knockout-punches'

import {
  altClickBindingHandler,
  ctrlClickBindingHandler,
  metaClickBindingHandler,
  shiftClickBindingHandler,
  jqueryBindingHandler,
  toggleBindingHandler,
  formateDateFilter,
  Route,
  Router,
  createScrollPositionMiddleware,
  childrenRoutePlugin,
  componentRoutePlugin,
  componentsRoutePlugin,
  componentInitializerRoutePlugin,
  redirectRoutePlugin,
  createtitleRoutePlugin,
  withRoutePlugin
} from '@profiscience/knockout-contrib'

/**
 * BINDINGS
 */

ko.bindingHandlers['click.alt'] = altClickBindingHandler
ko.bindingHandlers['click.ctrl'] = ctrlClickBindingHandler
ko.bindingHandlers['click.meta'] = metaClickBindingHandler
ko.bindingHandlers['click.shift'] = shiftClickBindingHandler

ko.bindingHandlers.jquery = jqueryBindingHandler
ko.bindingHandlers.$ = jqueryBindingHandler // alias

ko.bindingHandlers.toggle = toggleBindingHandler

/**
 * FILTERS
 */

// punches does not have type definitions...
const _ko: any = ko

// you may remove these 2 lines if you call ko.punches.enableAll() in your project
_ko.punches.textFilter.enableForBinding('text')
_ko.punches.textFilter.enableForBinding('attr')

_ko.filters['date.format'] = formatDateFilter

/**
 * ROUTING / "FRAMEWORK"
 */
Router.use(createScrollPositionMiddleware())

// NOTE: This _must_ be executed _before_ any routes are instantiated. If you're having issues,
// remember that ES imports are hoisted, so the file that registers these plugins _must_ be imported
// before are file that instatiates a route.
Route.usePlugin(
  withRoutePlugin, // should _probably_ be first (so addt'l values are available everywhere)
  redirectRoutePlugin, // should also _probably_ be towards the top of the list (to prevent unneccesary work)
  componentRoutePlugin,
  componentInitializerRoutePlugin, // **MUST** come after component plugin

  // for the rest of these, the order is irrelevant
  childrenRoutePlugin,
  componentsRoutePlugin,
  createtitleRoutePlugin(
    (titleSegments: string[]) => `My App | ${titleSegments.join(' > ')}`
  )
)
```

View the documentation for individual [packages](../packages) to see what they do / how to use them.

## Monorepo/Metapackage Rationale (i.e. Why is everything published as a separate package?)

_tl;dr it keeps you out of dependency hell_

Publishing a independent packages instead of a single package utilizing tree-shaking or nested imports (i.e. `import 'components/markdown'`) allows each package to have its own semver.

Take the following scenario...

> - you're using `components.a`
> - breaking changes are introduced into `components.a`
> - `components.b` is added, and now you want to use it

If both components are published together, you'd be required to update `components.a` before getting on with the work you set out to do with `components.b`. A monorepo grants the ability to avoid this nonsense while maintaining a unified build/test process.

One option is to require the installation of each individual package by the consumer, however this can lead to a lot of extra typing (especially with the length/verbosity of `@profiscience/knockout-contrib-*`).

Another is to provide a default metapackage which installs all of the independent packages without enforcing strict versioning, as is done here.

What this leads to is a behavior in which, by default, the latest version of each package will be installed. However, you may lock the version of any package by adding it explicitly to your `package.json`. Your package manager should resolve any cross-dependencies or version requirements from there.

[knockoutjs]: https://knockoutjs.com
[knockout-shield]: https://img.shields.io/badge/KnockoutJS-v3.5.0--rc-red.svg
[travis-ci]: https://travis-ci.org/Profiscience/knockout-contrib/
[travis-ci-shield]: https://img.shields.io/travis/Profiscience/knockout-contrib/master.svg
[codecov]: https://codecov.io/gh/Profiscience/knockout-contrib
[codecov-shield]: https://img.shields.io/codecov/c/github/Profiscience/knockout-contrib.svg
[gitter]: https://gitter.im/Profiscience/knockout-contrib
[gitter-shield]: https://img.shields.io/gitter/room/profiscience/knockout-contrib.svg
[metapackage]: https://askubuntu.com/questions/66257/what-is-the-difference-between-a-meta-package-and-a-package
[@profiscience/knockout-contrib]: https://github.com/Profiscience/knockout-contrib
