import * as ko from 'knockout'
import { fromJS } from '@profiscience/knockout-contrib-utils-from-js'

export function defaults<
  T extends { [k: string]: any | ko.Observable | ko.Computed | void }
>(dest: T, defaultValues: { [k: string]: any }, mapArraysDeep = false): T {
  for (const prop in defaultValues) {
    if (isUndefined(dest[prop])) {
      dest[prop] = fromJS(
        defaultValues[prop],
        defaultValues[prop] instanceof Array && mapArraysDeep
      )
    } else if (ko.isObservable(dest[prop]) && isUndefined(dest[prop]())) {
      dest[prop](defaultValues[prop])
    }
  }
  return dest
}

function isUndefined(foo: any): boolean {
  return typeof foo === 'undefined'
}
