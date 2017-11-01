import * as ko from 'knockout'
import fromJS from '@profiscience/knockout-contrib-utils-from-js'

export default function defaults<T extends { [k: string]: any | KnockoutObservable<any> | void }>(
  dest: T,
  defaults: { [k: string]: any },
  mapArraysDeep: boolean = false
): T {
  for (const prop in defaults) {
    if (isUndefined(dest[prop])) {
      dest[prop] = fromJS(defaults[prop], defaults[prop] instanceof Array && mapArraysDeep)
    } else if (ko.isObservable(dest[prop]) && isUndefined(dest[prop]())) {
      dest[prop](defaults[prop])
    }
  }
  return dest
}

function isUndefined(foo): boolean {
  return typeof foo === 'undefined'
}
