# bindings.draggable

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.draggable
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/bindings.draggable
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.draggable&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/bindings.draggable
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/bindings.draggable&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/bindings.draggable
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-bindings-draggable
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-bindings-draggable.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-bindings-draggable&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-bindings-draggable.svg?maxAge=2592000

> This package is intended for consumption via the [@profiscience/knockout-contrib][] metapackage

Drag and drop list re-ordering

## Usage

```html
<ul class="draggable-list-container" data-bind="foreach: foos">
  <li class="draggable-item-container">
    <i
      class="fa fa-bars"
      data-bind="draggable: {
        listContainerSelector: '.draggable-list-container',
        itemContainerSelector: '.draggable-item-container',
        list: $parent.foos,
        item: $data
      }"
    ></i>
  </li>
</ul>
```

```css
.draggable-list-container {
  /* position must be anything BUT static */
  position: relative;
}
```

[@profiscience/knockout-contrib]: https://github.com/Profiscience/knockout-contrib
