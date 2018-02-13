import * as ko from 'knockout'
import fromJS from '@profiscience/knockout-contrib-utils-from-js'

export default function merge<T extends { [k: string]: any }>(
  dest: T,
  src: { [k: string]: any },
  mapArraysDeep: boolean = false
): T {
  const props = Object.getOwnPropertyNames(src)

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
