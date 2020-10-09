# bindings.infiniteScroll

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.infiniteScroll
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/bindings.infiniteScroll
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.infiniteScroll&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/bindings.infiniteScroll
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.infiniteScroll&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/bindings.infiniteScroll
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-bindings-infinite-scroll
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-bindings-infinite-scroll.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-bindings-infinite-scroll&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-bindings-infinite-scroll.svg?maxAge=2592000

> This package is intended for consumption via the [@profiscience/knockout-contrib][] metapackage

Call a function when the end of an element is reached

## Usage

```html
<div data-bind="foreach: todos, infiniteScroll: fetchMoreTodos">...</div>
```

**with a custom offset**

By default the infinite scroll will trigger 1500px before reaching the bottom of the bound element. This can be customized, for example to preload slower APIs sooner you could define a larger offset.

```html
<div
  data-bind="foreach: todos, infiniteScroll: { handler: fetchMoreTodos, offset: 2000 }"
>
  ...
</div>
```

[@profiscience/knockout-contrib]: https://github.com/Profiscience/knockout-contrib
