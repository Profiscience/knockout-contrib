# @profiscience/knockout-contrib-utils-defaults

**NOTE:** It is recommended to use the [@profiscience/knockout-contrib-utils metapackage](../utils)


## Usage
> defaults(dest, defaultValues[, mapArrays = false])

Creates observables for enumerable string properties of `defaultValues` where undefined in the destination object.

If `mapArrays` is true, array elements will be created as mapped observables, else bare objects/primitives.

```javascript
import { defaults } from '@profiscience/knockout-contrib-utils'

const foos = { foo: 'foo' }
defaults(foos, { foo: 'bar', bar: 'bar' })

foos()
// { foo: 'foo', bar: 'bar' }
```
