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

## Using the ESNext build

> This assumes you are using webpack. It is likely possible with most other modern bundlers, but that's on you to figure out. If you would like to contribute documentation, PRs are accepted.

The default build is transpiled to ES5 in order to be compatible in older browsers (_\*cough\* IE_).

However, if you only need to support modern runtimes, you can use the esnext build. This build has much less transpilation overhead and does not require any additional runtime libraries (_e.g._ `babel-runtime`). This can have a pretty decent impact on the size of your builds when used with [babel-minify](https://github.com/babel/minify), and provides for a much nicer debugging experience should you find yourself digging through the stack somewhere in this library; transpiled code can be very difficult to reason about.

This library uses the [proposed `esnext` package.json field](https://github.com/stereobooster/package.json#esnext).

Add `esnext` to [`resolve.mainFields`](https://webpack.js.org/configuration/resolve/#resolve-mainfields) in your webpack config to use this build.

_e.g._

```javascript
module.exports = {
  resolve: {
    mainFields: [
      'esnext', // es2017+esm (resolves to <package>/dist/esnext)

      // these are the default values
      'module', // es5+esm  (resolves to <package>/dist/default)
      'main' // es5+cjs  (resolves to <package>/dist/node)
    ]
  }
}
```

## TypeScript Caveats

For reasons that are mostly related to my own development comfort, TypeScript is configured to point at the source instead of built definitions. What this comes down to is allowing parallel transpilation, however there is also the very real restriction that TypeScript refuses to emit a declaration for a mixin that uses a `private` or `protected` property.

That said, using this library with TypeScript requires a few properties to be set in your `tsconfig.json`.

```
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "h",
    "allowSyntheticDefaultImports": true,
    "lib": [
      "dom",
      "es5",
      "es2015",
      "esnext.asynciterable"
    ]
  }
}
```

You may omit `jsx` and `jsxFactory` if you are not using any component packages.

[knockoutjs]: https://knockoutjs.com
[knockout-shield]: https://img.shields.io/badge/KnockoutJS-v3.5.0--rc2-red.svg
[travis-ci]: https://travis-ci.org/Profiscience/knockout-contrib/
[travis-ci-shield]: https://img.shields.io/travis/Profiscience/knockout-contrib/master.svg
[codecov]: https://codecov.io/gh/Profiscience/knockout-contrib
[codecov-shield]: https://img.shields.io/codecov/c/github/Profiscience/knockout-contrib.svg
[gitter]: https://gitter.im/Profiscience/knockout-contrib
[gitter-shield]: https://img.shields.io/gitter/room/profiscience/knockout-contrib.svg
[metapackage]: https://askubuntu.com/questions/66257/what-is-the-difference-between-a-meta-package-and-a-package
[@profiscience/knockout-contrib]: https://github.com/Profiscience/knockout-contrib
