/// <reference path="increment.d.ts" />

import * as ko from 'knockout'

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
