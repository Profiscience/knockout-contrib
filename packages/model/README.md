# @profiscience/knockout-contrib-model

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

*NOTE:* Assumes a rudimentary understanding of [KnockoutJS][] and [Webpack][] (or the bundler du jour).

Composable view and data model builders for [KnockoutJS][] with [@profiscience/knockout-contrib-router][] integration designed with the following goals in mind...

#### User Experience

##### No Jarring
There are two main schools of thought on loaders and SPA navigation. The first is is to allow each view/component (and subview in nested routing) to manage itself. This yields a UX similar to Facebook, where parts of the page come in at different times. There is nothing wrong with this approach, but it requires more code, and more care to be taken in constraining dimensions in CSS so that the page doesn't jar — in many cases it's impossible to prevent jarring.

The alternative is the approach that is used here, which is to display a global loader and show that until the next page is completely ready, and then render it. No view is rendered until all of its data has been loaded.

GitHub uses this approach, and IMHO it is an optimal UX.

##### Lazy Loaded
Minimal code should be required for initial page load, as well as navigation.

#### Developer Experience

##### First-Class TypeScript Support
When following best-practices, types should be intuited as strictly as possible — i.e. `noImplicitAny` compatibility. TypeScript usage is henceforth assumed.

##### Minimal Logic Boilerplate
Boilerplate should be declarative and mostly confined to defining types.

Loading async data should require no extra effort additional code. i.e. there should be no need to wrap component templates with `if: ready` and create custom CSS
to prevent jarring. Nor should a developer have to create middleware by hand for each route.

##### Reusability
Heed to [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) principles. Prevent repetition wherever possible.

##### Testability
Unit testing views should be trivial. TDD should help a developer, not hurt.

##### Extensibility
Easily allow extending, taking care to avoid conflicts and prevent leaks by using [Symbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) where applicable.

## API

@TODO

```typescript
import { DataModelConstructorBuilder, ViewModelConstructorBuilder } from '@profiscience/knockout-contrib-model'
```

## Usage

- [Concepts][]
- [Best Practices][]

__app.js__
```typescript
import * as ko from 'knockout'
import { Route, Router } from '@profiscience/knockout-contrib-router'
import { componentPlugin, dataPlugin } from '@profiscience/knockout-contrib-router-plugins'

const home = new Route('/', {
  // via router.plugins.component package
  component: () => ({
    template: import('./template.html'),
    viewModel: import('./viewModel')
  })
})

Router
  .useRoutes(home)

Route
  // ** REQUIRED **
  .usePlugin(componentPlugin)

  // Must be registered ** AFTER ** component plugin. Delays render until all
  // DataModel properties on the viewModel instance have been initialized.
  .usePlugin(dataPlugin)

ko.applyBindings()
```

__viewModel.js__
```typescript
import { ViewModelConstructorBuilder } from '@profiscience/knockout-contrib-model'
import { DataModel } from './dataModel'

export default class ViewModel extends ViewModelConstructorBuilder {
  public data = new DataModel()
}
```

__dataModel.js__
```typescript
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model'

export interface IDataModelParams {}

export default class DataModel extends DataModelConstructorBuilder<IDataModelParams{
  public name: string

  public async fetch() {
    // assume this returns { name: 'Casey' }, as defined above
    return await $.get('https://example.com/api/name')
  }
}
```

__template.html__
```html
Hello, <span data-bind="text: data.name"></span>
```

Walking through this code step-by-step, the following occurs...

- Page is loaded on the home url (`/`)
- Router loads the component files (`viewModel.js` and `template.js`)
- componentPlugin creates a viewModel instance and registers component with `{ viewModel: { instance } }`
- **dataPlugin looks for DataModel instances on the viewModel instance; if found, prevents render until initialized**
- Router completes render

<!-- TOC -->
### Contents
- [builders.base](../model.builders.base)
- [builders.data](../model.builders.data)
- [builders.view](../model.builders.view)
- [mixins.pager](../model.mixins.pager)
- [mixins.subscriptionDisposal](../model.mixins.subscriptionDisposal)
<!-- /TOC -->


[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/model
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/model

[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/model&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/model

[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/model&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/model

[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-model
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-model.svg

[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-model&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-model.svg?maxAge=2592000

[KnockoutJS]: https://knockoutjs.com
[Webpack]: https://webpack.js.org
[@profiscience/knockout-contrib-router]: ../router

[Concepts]: https://profiscience.github.io/knockout-contrib/packages/model/docs/concepts
[Best Practices]: https://profiscience.github.io/knockout-contrib/packages/model/docs/best-practices