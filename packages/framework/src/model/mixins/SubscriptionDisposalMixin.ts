import * as ko from 'knockout'
import isFunction from 'lodash/isFunction'
import { ConstructorBuilder } from '../builders/ConstructorBuilder'

/**
 * Symbol to access subscriptions on viewModel instance
 */
export const SUBSCRIPTIONS = Symbol('SUBSCRIPTIONS')

/**
 * Adds .subscribe(obs, fn) and .dispose() methods with subscription tracking to prevent leaks
 *
 * Used by constructor builders
 *
 * @param ctor BaseModel
 */
export function SubscriptionDisposalMixin<T extends { new(...args: any[]): ConstructorBuilder }>(ctor: T) {
  return class Subscribable extends ctor {
    constructor(...args: any[]) {
      super(...args);
      (this as any)[SUBSCRIPTIONS] = []
    }

    /**
     * Create a subscription that will be disposed with the model
     *
     * Provides sugar for passing an accessor function or tree
     *
     * Example:
     *
     * ```typescript
     *  this.subscribe(obs, onChange)
     *  this.subscribe(() => obs(), onChange)
     *  this.subscribe({ obs }, onChange)
     * ```
     *
     * @param obs Observable to subscribe to
     * @param fn
     */
    public subscribe<T2>(obs: KnockoutObservable<T2>, fn: (newVal: T2) => void): KnockoutSubscription
    public subscribe<T2>(accessor: () => T2, fn: (newVal: T2) => void): KnockoutSubscription
    public subscribe<T2>(tree: any, fn: (newVal: any) => void): KnockoutSubscription
    public subscribe<T2>(arg: any, fn: any) {
      let obs: KnockoutObservable<any>

      if (ko.isObservable(arg)) {
        obs = arg
      } else if (isFunction(arg)) {
        obs = ko.pureComputed(arg)
      } else {
        obs = ko.pureComputed(() => ko.toJS(arg))
      }
      const sub = (obs as KnockoutObservable<T2>).subscribe((newVal: T2) => { fn(newVal) });
      (this as any)[SUBSCRIPTIONS].push(sub)
      return sub
    }

    /**
     * Dispose all subscriptions
     */
    public dispose() {
      (this as any)[SUBSCRIPTIONS].forEach((sub: KnockoutSubscription) => sub.dispose())
    }
  }
}
