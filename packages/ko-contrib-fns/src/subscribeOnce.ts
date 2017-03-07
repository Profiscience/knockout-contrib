/// <reference path="subscribeOnce.d.ts" />

import * as ko from 'knockout'

ko.observable.fn.subscribeOnce =
ko.observableArray.fn.subscribeOnce =
ko.computed.fn.subscribeOnce =
  function(fn: (v) => void): KnockoutSubscription {
    const killMe = this.subscribe((v) => {
      killMe.dispose()
      fn(v)
    })
    return killMe
  }
