import * as ko from 'knockout'
import { ConstructorBuilder } from './ConstructorBuilder'

export const SUBSCRIPTIONS = Symbol('SUBSCRIPTIONS')

export function SubscribableMixin<T extends { new(...args: any[]): ConstructorBuilder }>(ctor: T) {
  return class Subscribable extends ctor {
    constructor(...args: any[]) {
      super(...args);
      (this as any)[SUBSCRIPTIONS] = []
    }

    public subscribe<T2>(
      obs: KnockoutObservable<T2> | KnockoutObservableArray<T2>,
      fn: (newVal: T2) => void
    ): KnockoutSubscription {
      const sub = (obs as KnockoutObservable<T2>).subscribe((newVal: T2) => { fn(newVal) });
      (this as any)[SUBSCRIPTIONS].push(sub)
      return sub
    }

    public dispose() {
      (this as any)[SUBSCRIPTIONS].forEach((sub: KnockoutSubscription) => sub.dispose())
    }
  }
}
