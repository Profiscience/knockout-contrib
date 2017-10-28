import * as ko from 'knockout'
import { PlainObject, KnockoutObservableTree } from './_types'
import fromJS from './fromJS'

export default function merge(
  dest: PlainObject,
  src: PlainObject,
  mapArraysDeep: boolean = false
): KnockoutObservableTree {
  const props = Object.keys(src)

  for (const prop of props) {
    if (isUndefined(dest[prop])) {
      dest[prop] = fromJS(src[prop], src[prop] instanceof Array && mapArraysDeep)
    } else if (ko.isObservable(dest[prop])) {
      dest[prop](
        src[prop] instanceof Array && mapArraysDeep
          ? ko.unwrap(fromJS(src[prop], true))
          : src[prop]
      )
    } else if (isUndefined(src[prop])) {
      dest[prop] = undefined
    } else if (src[prop].constructor === Object) {
      merge(dest[prop], src[prop], mapArraysDeep)
    } else {
      dest[prop] = src[prop]
    }
  }

  return dest
}

function isUndefined(foo): boolean {
  return typeof foo === 'undefined'
}
