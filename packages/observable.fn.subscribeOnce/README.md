# @profiscience/knockout-contrib-observable-fn-increment

**NOTE:** It is recommended to use the [@profiscience/knockout-contrib-observable-fn metapackage](../observable.fn)

Creates a subscription that is called once and then disposed.

## Usage observable<T>.fn.subscribeOnce(fn: (newValue: T) => void)

```javascript
import '@profiscience/knockout-contrib-observable-fn/subscribeOnce'

const foo = ko.observable(0)

foo.subscribeOnce(() => console.log('hit!'))

foo(1)
// hit!

foo(2)
// nothing...
```