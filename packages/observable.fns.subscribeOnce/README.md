# @profiscience/knockout-contrib-observable-fns-increment

**NOTE:** It is recommended to use the [@profiscience/knockout-contrib-observable-fns metapackage](../observable.fns)

###### observable<T>.fn.subscribeOnce(fn: (newValue: T) => void)

Creates a subscription that is called once and then disposed.

```javascript
import '@profiscience/knockout-contrib-observable-fns/subscribeOnce'

const foo = ko.observable(0)

foo.subscribeOnce(() => console.log('hit!'))

foo(1)
// hit!

foo(2)
// nothing...
```