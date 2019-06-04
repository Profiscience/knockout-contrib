import * as ko from 'knockout'
import { fromJS } from '@profiscience/knockout-contrib-utils-from-js'

export function defaults<
  TSrc extends Record<string, any>,
  TDest extends {
    [P in keyof TSrc]?: TSrc[P] extends []
      ? ko.ObservableArray<TSrc[P][0]>
      : ko.Observable<TSrc[P]>
  }
>(dest: TDest, defaultValues: TSrc, mapArraysDeep = false): TDest {
  for (const prop in defaultValues) {
    if (defaultValues.hasOwnProperty(prop)) {
      const maybeDestObservable = dest[prop]
      if (isUndefined(maybeDestObservable)) {
        dest[prop] = fromJS(
          defaultValues[prop],
          (defaultValues[prop] as any) instanceof Array && mapArraysDeep
        )
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

function isUndefined(foo: any): boolean {
  return typeof foo === 'undefined'
}
