# @profiscience/knockout-contrib-utils-from-js

**NOTE:** It is recommended to use the [@profiscience/knockout-contrib-utils metapackage](../utils)

## Usage
> fromJS(src[, mapArrays = false])

Creates a tree of observables from `src`.

If `mapArrays` is true, array elements will be created as mapped observables, else bare objects/primitives.

The much needed inverse to the undocumented `ko.toJS` function; a dumb version of [ko.mapping.fromJS](http://knockoutjs.com/documentation/plugins-mapping.html)
that is a lot faster.

```javascript
import { fromJS } from '@profiscience/knockout-contrib-utils'

const foos = {
  foo: 'foo',
  bar: {
    baz: 'baz',
    qux: ['qux']
  }
}

fromJS(foos, true)
// {
//   foo: ko.observable('foo'),
//   bar: {
//     baz: ko.observable('baz'),
//     qux: ko.observableArrap([
//       ko.observable('qux')
//     ])
//   }
// }
```