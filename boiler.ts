/**
 * This file provides a recommended starting point for using this repository
 * (https://github.com/Profiscience/knockout-contrib)
 *
 * Copy this to your project, and remove the pieces you don't need.
 *
 * **Don't'** change the knockout-contrib import statement to an `import *`
 * if you remove anything, otherwise you will not be able to take advantage of
 * tree-shaking.
 */

import * as ko from 'knockout'

/**
 * Bindings
 */
import {
  altClickBindingHandler,
  ctrlClickBindingHandler,
  metaClickBindingHandler,
  shiftClickBindingHandler,
  jqueryBindingHandler,
  toggleBindingHandler
} from '@profiscience/knockout-contrib/bindings'

ko.bindingHandlers['click.alt'] = altClickBindingHandler
ko.bindingHandlers['click.ctrl'] = ctrlClickBindingHandler
ko.bindingHandlers['click.meta'] = metaClickBindingHandler
ko.bindingHandlers['click.shift'] = shiftClickBindingHandler

ko.bindingHandlers.jquery = jqueryBindingHandler
ko.bindingHandlers.$ = jqueryBindingHandler // alias

ko.bindingHandlers.toggle = toggleBindingHandler

/**
 * You may desire to attach some of the more used utilities to the observable prototype so that they
 * may be used more easily.
 *
 * For example, instead of importing the increment utility wherever it is used, it may be attached
 * to the prototype and invoked like `obs.increment()`.
 *
 * To enable this syntax, uncomment the following...
 */
// import {
//   increment,
//   decrement,
//   modify,
//   once,
//   toggle
// } from '@profiscience/knockout-contrib/utils'

// function extendObservableProto(fnName: string, fn: (obs: KnockoutObservable<any>, ...rest: any[]) => any, arrays: boolean | 'only') {
//   function protoWrapper(...args: any[]) { return fn(this, ...args) }
//   if (arrays !== 'only') {
//     ko.observable.fn[fnName] = protoWrapper
//     ko.computed.fn[fnName] = protoWrapper
//   }
//   if (arrays) {
//     ko.observableArray.fn[fnName] = protoWrapper
//   }
// }

// extendObservableProto('increment', increment, false)
// extendObservableProto('decrement', decrement, false)
// extendObservableProto('modify', modify, true)
// extendObservableProto('once', once, true)
// extendObservableProto('toggle', toggle, false)

// declare global {
//   // tslint:disable-next-line:interface-name
//   interface KnockoutObservableFunctions<T> {
//     increment(num?: number): number
//     decrement(num?: number): number
//     modify(fn: (v: T) => T): T
//     once(fn: (v: T) => void): KnockoutSubscription
//     toggle(): boolean
//   }
// }
