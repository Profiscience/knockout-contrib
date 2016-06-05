import ko from 'knockout'

ko.observable.fn.toString = function() { return toString(this, 'Observable') }
ko.observableArray.fn.toString = function() { return toString(this, 'ObservableArray') }
ko.computed.fn.toString = function() { return toString(this, 'Computed') }

function toString(obs, type) {
  return `${type}(${ko.toJSON(obs(), null)})`
}
