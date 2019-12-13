# component-loader

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/component-loader
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/component-loader
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/component-loader&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/component-loader
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/component-loader&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/component-loader
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-component-loader
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-component-loader.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-component-loader&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-component-loader.svg?maxAge=2592000

> This package is intended for consumption via the [@profiscience/knockout-contrib][] metapackage

An easier to use component loader for Knockout. Supports lazy-loading and transforming component configs.

## Usage

```ts
import { ComponentLoader } from '@profiscience/knockout-contrib'

// Knockout component configuration
import appNavComponent from './app-nav'

const manifest = {
  // synchronous component
  'app-nav': {
    template: '...',
    viewModel: class {}
  },

  // lazy-loaded component
  widget: () => import('./widget')
}

const componentLoader = new ComponentLoader(manifest)

ko.components.loaders.unshift(componentLoader)
```

**with webpack**

Webpack's `require` has a `context` method that can be used with a regular expression to automatically load components without having to manually list all of them in the manifest.

For more information, see [webpack's documentation](./https://webpack.js.org/guides/dependency-management/#requirecontext).

```ts
const _require = require.context(
  './', // directory
  true, // use subdirectories
  /\.\/[^/_]+\/index\.(j|t)s$/, // all "<component-name>/index.js" (or ts) files relative to the directory argument, omitting those that begin with an underscore
  'lazy' // webpack require mode; see https://webpack.js.org/api/module-methods/#magic-comments
)

const componentLoader = ComponentLoader.fromRequireContext(_require)
```

**with custom component configuration**

You may pass a `transform` option to transform the component config before it is registered.

```ts
const manifest = {
  'my-component': {
    template: '...'
  }
}

const componentLoader = new ComponentLoader(manifest, {
  transform: (component) => {
    component.template = `<span style="border: 1px solid red">${component.template}</span>`
    return component
  }
})
```

[@profiscience/knockout-contrib]: https://github.com/Profiscience/knockout-contrib
