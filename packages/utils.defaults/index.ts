import * as ko from 'knockout'
import { fromJS } from '@profiscience/knockout-contrib-utils-from-js'

export function defaults<
  TSrc extends Record<string, unknown>,
  TDest extends {
    [P in keyof TSrc]?: TSrc[P] extends []
      ? ko.ObservableArray<TSrc[P][0]>
      : ko.Observable<TSrc[P]>
  }
>(dest: TDest, defaultValues: TSrc, mapArraysDeep = false): TDest {
  for (const prop in defaultValues) {
    if (Object.hasOwnProperty.call(defaultValues, prop)) {
      const maybeDestObservable = dest[prop]
      if (isUndefined(maybeDestObservable)) {
        dest[prop] = fromJS(
          defaultValues[prop],
          defaultValues[prop] instanceof Array && mapArraysDeep
        ) as TDest[Extract<keyof TSrc, string>]
      } else if (
        ko.isObservable(maybeDestObservable) &&
        isUndefined(maybeDestObservable())
      ) {
        maybeDestObservable(defaultValues[prop])
      }
    }
  }
  return dest
}

function isUndefined(foo: unknown): boolean {
  return typeof foo === 'undefined'
}
