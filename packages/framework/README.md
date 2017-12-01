# @profiscience/framework

[![Version][npm-version-shield]][npm]
[![License][wtfpl-shield]][wtfpl]
[![Build Status][travis-ci-shield]][travis-ci]
[![Coverage States][codecov-shield]][codecov]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]

[API Documentation](./docs)

## Introduction

This is an opinionated, declarative framework for [KnockoutJS][] built on top of [@profiscience/knockout-contrib-router][] for building modern SPAs.

It focuses on making dealing with async data sources (APIs, IndexedDB, etc.) less painful. Stop worrying about wrapping each of your views in a `if: ready` binding and implementing loaders all over the place. The approach used is GitHub-esque, i.e. don't render anything (except maybe a global loader) until we have all the data (this is in contrast to the Facebook approach, where each component loads data and is rendered independently). IMHO, this provides a less jarring experience and less boilerplate.

*NOTE:* Assumes a rudimentary understanding of [KnockoutJS][] (and [Webpack][]). Familiarity with [@profiscience/knockout-contrib-router][] is a plus.

## Installation

```bash
$ yarn add @profiscience/framework
```

## Basic Usage

__app.js__
```typescript
import * as ko from 'knockout'
/**
 * Router is re-exported from '@profiscience/knockout-contrib-router' for convenience/consistency
 */
import { Router, Route } from '@profiscience/framework'

const home = new Route('/', {
  /**
   * Define document title
   */
  title: 'My App',

  component: () => ({
    /**
     * Assuming you're using Webpack (with html-loader), this defines a split point. `component`
     * is a function so that the template and viewModel are only loaded on-demand when needed.
     */
    template: import('./template.html'),
    viewModel: import('./viewModel')
  })
})

Router.useRoutes(home)

ko.applyBindings()
```

__viewModel.js__
```typescript
import { ViewModelConstructorBuilder } from '@profiscience/framework'
import { DataModel } from './dataModel'

export default class ViewModel extends ViewModelConstructorBuilder {
  /**
   * Instantiate the dataModel
   */
  public data = new DataModel()
}
```

__dataModel.js__
```typescript
import { DataModelConstructorBuilder } from '@profiscience/framework'

/**
 * Read more about params in the usage docs
 */
export interface IDataModelParams {}

export default class DataModel extends DataModelConstructorBuilder<IDataModelParams> {
  public name: string

  /**
   * Implement the data accessor; best practice is to use a mixin, keep reading for more.
   */
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

This is the most bare-bones example of usage which includes an async data source, so lets walk through what happens step-by-step...

- Page is loaded on the home url (`/`)
- Router sets the document title to "My App"
- Router loads the component files (`viewModel.js` and `template.js`)
- Router instantiates a viewModel instance, and looks for DataModel instances on the enumerable properties
- If DataModel instance is found, wait for initialization
- Register component using `{ viewModel: { instance } }`
- Render

## Concepts

### Constructor Builders and Mixins

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

Two constructor builder classes are exported by the framework, the [DataModelConstructorBuilder][] and the [ViewModelConstructorBuilder][]...

### Data Models

Data models, unsuprisingly, use the [DataModelConstructorBuilder][]. They contain...

a) logic to retrieve data from the store (HTTP API, LocalStorage, IndexedDB, etc...)  
b) any business logic related to the data (modifying, saving, etc...)  
c) any computed properties  

They are intimately tied to routing to allow async operations to complete before rendering, eliminating the need to handle an unititialized state in each view.

> There are two main schools of thought on loaders and SPA navigation. The first is
> is to allow each view/component (and subview in nested routing) to manage itself. This yields
> a UX similar to Facebook, where parts of the page come in at different times. There is nothing
> wrong with this approach, but it requires more code, and more care to be taken in constraining
> dimensions in CSS so that the page doesn't jar — in many cases it's impossible to prevent jarring.
> The alternative is to use a global loader and show that until the next page is completely ready,
> and then render it. GitHub uses this approach. IMHO, it's generally a better UX and, I can't
> re-iterate this enough, it's less boilerplate, and less work.
>
> Now, that being said, particularly heavy/slow sections/components may still need to be lazy-loaded
> for the best performance. For example, we lazy load medium-editor and select2 inputs in their respective
> components. Use discretion, and always profile.

### View Models

View models extend [ViewModelConstructorBuilder][] and contain the UI logic. For example, click handlers, (most) subscriptions, etc.

As a general rule of thumb, view models need the DOM to make sense, and data models shouldn't touch it. If
whatever you are implementing is a reaction to the DOM, reads/writes the DOM, or does anything at all with
the DOM, it should be in the view model. Otherwise, stick it in the data model.

### Routing

Routing uses [@profiscience/knockout-contrib-router](https://github.com/profiscience/knockout-contrib/tree/master/packages/router), but provides its own [Route][] class (unrelated to the `Route` class in the router package) for transforming a route config into middleware (what plugins do in the router, but not in the global scope). As mentioned above, it is intimately tied to the [DataModelConstructorBuilder][] implementation in order to load data before rendering. 

---

Still interested? Check out the [API documentation](./docs).

[KnockoutJS]: http://knockoutjs.com/
[@profiscience/knockout-contrib-router]: https://github.com/profiscience/knockout-contrib/tree/master/packages/router/
[Webpack]: https://webpack.js.org/

[Route]: ./docs/classes/route
[DataModelConstructorBuilder]: ./docs/classes/datamodelconstructorbuilder
[ViewModelConstructorBuilder]: ./docs/classes/viewmodelconstructorbuilder

[travis-ci]: https://travis-ci.org/Profiscience/framework/
[travis-ci-shield]: https://img.shields.io/travis/Profiscience/framework/master.svg

[codecov]: https://codecov.io/gh/Profiscience/framework
[codecov-shield]: https://img.shields.io/codecov/c/github/Profiscience/framework.svg

[david-dm]: https://david-dm.org/Profiscience/framework
[david-dm-shield]: https://david-dm.org/Profiscience/framework/status.svg

[david-dm-peer]: https://david-dm.org/Profiscience/framework?type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/framework/peer-status.svg

[david-dm-dev]: https://david-dm.org/Profiscience/framework?type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/framework/dev-status.svg

[npm]: https://www.npmjs.com/package/@profiscience/framework
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/framework.svg

[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/framework&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/framework.svg?maxAge=2592000

[wtfpl]: ./LICENSE
[wtfpl-shield]: https://img.shields.io/npm/l/@profiscience/framework.svg