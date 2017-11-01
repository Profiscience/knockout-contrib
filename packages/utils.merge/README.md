# @profiscience/knockout-contrib-utils-merge

**NOTE:** It is recommended to use the [@profiscience/knockout-contrib-utils metapackage](../utils)

## Usage
> merge(dest, src[, mapArrays = false])

For each enumerable property of src,
  a) creates an observable when undefined on dest
  b) updates when existing observable on dest
  c) sets when existing non-observable on dest.

If `mapArrays` is true, array elements will be created as mapped observables, else bare objects/primitives.
__NOTE__: Merging new arrays onto existing ones that have been mapped deep will create new observable elements,
__not__ update the existing ones. No attempts are made to key elements, nor will they. If you need more, you
probably want [ko.mapping](http://knockoutjs.com/documentation/plugins-mapping.html) which is much more powerful,
but far slower.

```javascript
import { merge } from '@profiscience/knockout-contrib-utils'

const foos = {
  foo: ko.observable('foo'),
  bar: 'bar'
}

merge(foos, {
  foo: 'new foo',
  bar: 'new bar',
  baz: 'baz'
})

foos()
// {
//   foo: ko.observable('new foo'),
//   bar: 'new bar',
//   baz: ko.observable('baz')
// }
```
