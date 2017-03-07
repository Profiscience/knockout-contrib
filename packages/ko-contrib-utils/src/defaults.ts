import * as ko from 'knockout'
import { PlainObject, KnockoutObservableTree } from './_types'
import fromJS from './fromJS'

export default function defaults(
  dest: PlainObject,
  defaults: PlainObject,
  mapArraysDeep: boolean = false
): KnockoutObservableTree {
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
