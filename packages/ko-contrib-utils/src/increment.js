import ko from 'knockout'

ko.observable.fn.increment = function(amt = 1) {
  this(this() + amt)
}

ko.observable.fn.decrement = function(amt = 1) {
  this(this() - amt)
}
