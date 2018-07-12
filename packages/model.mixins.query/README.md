# model.mixins.query

> This package is intended to be consumed via the [@profiscience/knockout-contrib](../_) metapackage

Adds a `.query` property using the [query](../query) package for persistent, stateless data model params.

In other words, initializes data model params via the querystring, and mirrors changes so that the same query will be applied if the page is reloaded. Useful for making bookmark-able pages.

See the [query](../query) package for more details.

## Usage

```typescript
import {
  DataModelConstructorBuilder,
  QueryMixin
} from '@profiscience/knockout-contrib'

class MyDataModel extends DataModelConstructorBuilder.Mixin(
  QueryMixin(
    { someQuerystringParameter: '' } /* Query options (see query package) */
  )
)<any> {}

const model = new MyDataModel()

// if querystring contains `?someQuerystringParameter=foo`
model.query.someQuerystringParameter() === 'foo'

// update querystring to `?someQuerystringParameter=bar`
model.query.someQuerystringParameter('bar')

// query params are mirrored on `.params`, so it plays well will mixins
// that follow the correct conventions w/o additional buy in
model.params.someQuerystringParameter()
```
