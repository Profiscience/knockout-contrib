import ko from 'knockout'

ko.observable.fn.increment = ko.computed.fn.increment = function(amt = 1) {
  if (!ko.isWritableObservable(this)) {
    throw new Error('ko.computed.fn.increment requires a writable computed')
  }
  this(this() + amt)
}

ko.observable.fn.decrement = ko.computed.fn.decrement = function(amt = 1) {
  if (!ko.isWritableObservable(this)) {
    throw new Error('ko.computed.fn.decrement requires a writable computed')
  }
  this(this() - amt)
}
