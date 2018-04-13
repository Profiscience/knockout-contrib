import * as ko from 'knockout'

declare global {
  // tslint:disable-next-line interface-name
  interface KnockoutObservableFunctions<T> {
    toString(): string
  }
}

enum KnockoutObservableType {
  Observable = 'Observable',
  ObservableArray = 'ObservableArray',
  Computed = 'Computed'
}

ko.observable.fn.toString = function(this: KnockoutObservable<any>): string {
  return toString(this, KnockoutObservableType.Observable)
}

ko.observableArray.fn.toString = function(this: KnockoutObservable<any>): string {
  return toString(this, KnockoutObservableType.ObservableArray)
}

ko.computed.fn.toString = function(this: KnockoutObservable<any>): string {
  return toString(this, KnockoutObservableType.Computed)
}

function toString(obs: KnockoutObservable<any>, type: KnockoutObservableType): string {
  return `${type}(${ko.toJSON(obs())})`
}
