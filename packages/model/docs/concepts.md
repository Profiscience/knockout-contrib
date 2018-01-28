# Concepts

- [Constructor Builders / Mixins](#constructor-builders)
- [View Models](#view-models)
- [Data Models](#data-models)

#### <span id="constructor-builders">Constructor Builders and Mixins</span>

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

#### <span id="data-models">Data Models</span>

Data models contain...

a) logic to retrieve data from the store (HTTP API, LocalStorage, IndexedDB, etc...)  
b) any business logic related to the data (modifying, saving, etc...)  
c) any computed properties

For the purposes of this package, they are intimately tied to the `frameworkPlugin` to ensure all data has been loaded prior to rendering a page.

#### <span id="view-models">View Models</span>

View models contain UI logic. For example, click handlers, (most) subscriptions, etc.

As a general rule of thumb, view models need the DOM to make sense, and data models shouldn't touch it. If whatever you are implementing is a reaction to the DOM, reads/writes the DOM, or does anything at all with the DOM, it should be in the view model. Otherwise, stick it in the data model.