interface KnockoutObservableFunctions<T> {
  subscribeOnce(fn: (v: T) => void): KnockoutSubscription
}
