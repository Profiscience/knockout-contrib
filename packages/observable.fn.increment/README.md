# @profiscience/knockout-contrib-observable-fn-increment

**NOTE:** It is recommended to use the [@profiscience/knockout-contrib-observable-fn metapackage](../observable.fn)

Increments/decrements numeric observables

## Usage

```javascript
import '@profiscience/knockout-contrib-observable-fn/increment'

const foo = ko.observable(0)

foo.increment()   // 1
foo.increment(3)  // 4
foo.decrement()   // 3
foo.decrement(2)  // 1
```