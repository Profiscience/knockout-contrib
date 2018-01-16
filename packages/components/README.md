# @profiscience/knockout-contrib-components

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

> This is a metapackage including all `@profiscience/knockout-contrib-components-*` packages

[Custom components](https://knockoutjs.com/documentation/component-overview.html) for [KnockoutJS][]

<!-- TOC -->
### Contents
- [flash-message](../components.flash-message)
<!-- /TOC -->

### Usage

Importing a component will add it to Knockout's global registry with the `contrib` prefix. e.g. `<contrib-flash-message></contrib-flash-message>`

You may import a single binding, or all of them.

```javascript
// import all
import '@profiscience/knockout-contrib-components'

// import single
import '@profiscience/knockout-contrib-components/flash-message' 
```

### Styles

Components use [Bootstrap v4][] as a base, and [CSS modules][] for any additional styling. If you are using [Webpack][], add the following to your configuration...

```typescript
module.exports = {
  module: {
    rules: [
      require('@profiscience/knockout-contrib-components/webpack')
    ]
  }
}
```

[KnockoutJS]: https://knockoutjs.com
[Bootstrap v4]: https://getbootstrap.com/
[CSS modules]: https://github.com/css-modules/css-modules
[Webpack]: https://webpack.js.org

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/components
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/components

[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/components&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/components

[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/components&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/components

[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-components
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-components.svg

[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-components&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-components.svg?maxAge=2592000