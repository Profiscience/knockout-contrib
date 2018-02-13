import * as ko from 'knockout'

declare global {
  // tslint:disable-next-line interface-name
  interface KnockoutObservableFunctions<T> {
    toggle(): void
  }
}

ko.observable.fn.toggle =
ko.computed.fn.toggle =
  function(this: KnockoutObservable<boolean>): void {
    const obs: KnockoutObservable<boolean> = this
    obs(!obs())
  }
