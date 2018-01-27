# Best Practices

**Always** fetch data from stores using the [DataModelConstructorBuilder][]

---

**Always** use the [ViewModelConstructorBuilder][] for component viewModels

---

**Always** use the `.subscribe()` method supplied by the [SubscriptionDisposalMixin][] (which is included with both the [DataModelConstructorBuilder][] and [ViewModelConstructorBuilder][]) for subscribing to observables

[DataModelConstructorBuilder]: https://profiscience.github.io/knockout-contrib/packages/framework/docs/typedoc/classes/datamodelconstructorbuilder
[ViewModelConstructorBuilder]: https://profiscience.github.io/knockout-contrib/packages/framework/docs/typedoc/classes/viewmodelconstructorbuilder
[SubscriptionDisposalMixin]: https://profiscience.github.io/knockout-contrib/packages/framework/docs/typedoc#subscriptiondisposalmixin