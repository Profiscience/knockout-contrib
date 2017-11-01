import * as ko from 'knockout'

declare global {
  interface KnockoutObservableFunctions<T> {
    subscribeOnce(fn: (v: T) => void): KnockoutSubscription
  }
}

ko.observable.fn.subscribeOnce =
ko.observableArray.fn.subscribeOnce =
ko.computed.fn.subscribeOnce =
  function(fn: (v) => void): KnockoutSubscription {
    const killMe = this.subscribe((v) => {
      // killMe.dispose()
      fn(v)
    })
    return killMe
  }
