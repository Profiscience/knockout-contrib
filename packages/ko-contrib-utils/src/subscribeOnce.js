import ko from 'knockout'

ko.observable.fn.subscribeOnce = ko.observableArray.fn.subscribeOnce = ko.computed.fn.subscribeOnce = subscribeOnce

function subscribeOnce(fn) {
  const killMe = this.subscribe((v) => {
    killMe.dispose()
    fn(v)
  })
}
