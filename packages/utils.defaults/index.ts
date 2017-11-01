import * as ko from 'knockout'
import fromJS from '@profiscience/knockout-contrib-utils-from-js'

export default function defaults<T>(
  dest: { [k: string]: T | KnockoutObservable<T> | void },
  defaults: { [k: string]: T },
  mapArraysDeep: boolean = false
): { [k: string]: T | KnockoutObservable<T> } {
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
