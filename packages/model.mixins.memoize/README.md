# model.mixins.memoize

> This package is intended to be consumed via the [@profiscience/knockout-contrib](../_) metapackage

Memoize model instantiation, i.e. re-use existing model instance if a new one is created with identical params

If any params are observable, the observable _instance_ is used for comparison, not the value.

See the [test](./test.ts) for more.
