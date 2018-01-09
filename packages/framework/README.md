# @profiscience/knockout-contrib-framework

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

## Introduction

This is an minimal "framework" for [KnockoutJS][] built on top of the [router][] package which makes dealing with a) async data sources (APIs, IndexedDB, etc.), b) mixins (particularly type-safe mixins), less painful.

It accomplishes the former by coupling a [route plugin][] and the [DataModelConstructorBuilder][] class, and the latter with something we're calling a "constructor builder," more on that below.

> There are two main schools of thought on loaders and SPA navigation. The first is
> is to allow each view/component (and subview in nested routing) to manage itself. This yields
> a UX similar to Facebook, where parts of the page come in at different times. There is nothing
> wrong with this approach, but it requires more code, and more care to be taken in constraining
> dimensions in CSS so that the page doesn't jar — in many cases it's impossible to prevent jarring.
> The alternative is to use a global loader and show that until the next page is completely ready,
> and then render it. GitHub uses this approach. IMHO, it's generally a better UX and, less boilerplate, and less work.
>
> That being said, particularly heavy/slow sections/components may still need to be lazy-loaded
> for the best performance. For example, we lazy load medium-editor and select2 inputs in their respective
> components. Use discretion, and always profile.

*NOTE:* Assumes a rudimentary understanding of [KnockoutJS][] (and [Webpack][]).

### Concepts

#### Constructor Builders and Mixins

Composition in TypeScript is weird. The [official documentation on mixins](https://www.typescriptlang.org/docs/handbook/mixins.html) requires a ton of duplication and was a non-starter for that reason. This documentation is out of date as [2.2 brought proper mixin support](https://blogs.msdn.microsoft.com/typescript/2017/02/22/announcing-typescript-2-2/) (if you have no idea what mixins are or how to write them, this is the link you should read first), but still, there is (AFAIK) no way to implement a type-safe `applyMixins` function.

Because of this limitation, in order to use multiple mixins, you must use...

```typescript
class extends Mixin1(Mixin2(Mixin3(BaseModel))) {
  constructor() {}
}
```

This syntax begins to become extremely noisy when other arguments are added, even in the best case as variables...

```typescript
class extends PaginationMixin(paginationOpts, InMemoryCachingMixin(inMemoryCachingOpts, AJAXMixin(ajaxOpts, BaseModel))) {
  constructor() {}
}
```

Being noisy (and accumulating a mass of trailing parens) isn't the only flaw though. Consider for a moment how you'd comment out a single mixin — or reorder them; it's messy.

After a lot of toying around, I found a pattern that maintains type-safety/autocompletion and allows a (IMO) preferable chaining syntax I'm dubbing a "constructor builder" pattern. Implementing the above in this pattern yields the following...

```typescript
class extends ConstructorBuilder
  .Mixin(PaginationMixin(paginationOpts))
  .Mixin(InMemoryCachingMixin(inMemoryCachingOpts))
  .Mixin(AJAXMixin(ajaxOpts)) {

  constructor() {}
}
```

*NOTE:* Mixins either actually functions that return mixins. In other words, they're [curried](https://wiki.haskell.org/Currying) versions of the ones used in the previous example.

With this syntax, readability is maintained even when expanding the option variables...

```typescript
class extends ConstructorBuilder
  .Mixin(PaginationMixin({
    property: 'users',
    pageSize: 10
  }))
  .Mixin(InMemoryCachingMixin({
    trackBy: {
      users: {
        id: true
      }
    }
  }))
  .Mixin(AJAXMixin('http://example.com/api/users')) {

  constructor() {}
}
```

#### Data Models

Data models use the [DataModelConstructorBuilder][] and contain...

a) logic to retrieve data from the store (HTTP API, LocalStorage, IndexedDB, etc...)  
b) any business logic related to the data (modifying, saving, etc...)  
c) any computed properties

They are intimately tied to the `frameworkPlugin` to allow async operations to complete before rendering, eliminating the need to handle an unititialized state in each view.

#### View Models

View models extend [ViewModelConstructorBuilder][] and contain UI logic. For example, click handlers, (most) subscriptions, etc.

As a general rule of thumb, view models need the DOM to make sense, and data models shouldn't touch it. If
whatever you are implementing is a reaction to the DOM, reads/writes the DOM, or does anything at all with
the DOM, it should be in the view model. Otherwise, stick it in the data model.

Both the [DataModelConstructorBuilder][] and [ViewModelConstructorBuilder][] use the [SubscriptionDisposalMixin][].

## Usage

__app.js__
```typescript
import * as ko from 'knockout'
import { Route, Router } from '@profiscience/knockout-contrib-router'
import { componentPlugin } from '@profiscience/knockout-contrib-router-plugins'
import { frameworkPlugin } from '@profiscience/knockout-contrib-framework'

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
  .usePlugin(frameworkPlugin)

ko.applyBindings()
```

__viewModel.js__
```typescript
import { ViewModelConstructorBuilder } from '@profiscience/knockout-contrib-framework'
import { DataModel } from './dataModel'

export default class ViewModel extends ViewModelConstructorBuilder {
  public data = new DataModel()
}
```

__dataModel.js__
```typescript
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-framework'

export interface IDataModelParams {}

export default class DataModel extends DataModelConstructorBuilder<IDataModelParams> {
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
- **frameworkPlugin looks for DataModel instances on the viewModel instance; if found, prevents render until initialized**
- Router completes render

The bolded line is the magic provided by this package.


## API

API documentation is generated via TypeDoc and may be viewed [here](https://profiscience.github.io/knockout-contrib/packages/framework/docs/typedoc). All listed items are available as named exports (see usage below).

---

<!-- TOC -->
## Contents
- [model.builders.base](../framework.model.builders.base)
- [model.builders.data](../framework.model.builders.data)
- [model.builders.view](../framework.model.builders.view)
- [model.mixins.subscriptionDisposal](../framework.model.mixins.subscriptionDisposal)
- [plugin](../framework.plugin)
<!-- /TOC -->


[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/framework
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/framework

[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/framework&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/framework

[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/framework&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/framework

[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-framework
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-framework.svg

[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-framework&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-framework.svg?maxAge=2592000