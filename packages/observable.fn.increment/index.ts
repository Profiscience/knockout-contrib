import * as ko from 'knockout'

declare global {
  // tslint:disable-next-line interface-name
  interface KnockoutObservableFunctions<T> {
    increment(amt?: number): void
    decrement(amt?: number): void
  }
}

ko.observable.fn.increment =
ko.computed.fn.increment =
  function(amt?: number): void {
    increment(this, amt)
  }

ko.observable.fn.decrement =
ko.computed.fn.decrement =
  function(amt?: number): void {
    decrement(this, amt)
  }

function increment(
  obs: KnockoutObservable<number>,
  amt: number = 1
): void {
  obs(obs() + amt)
}

function decrement(
  obs: KnockoutObservable<number>,
  amt: number = 1
): void {
  obs(obs() - amt)
}
