import ko from 'knockout'
import fromJS from './fromJS'

export default function merge(dest, src, mapArraysDeep) {
  const props = Object.keys(src)

  for (const prop of props) {
    if (isUndefined(dest[prop])) {
      dest[prop] = fromJS(src[prop], src[prop] instanceof Array && mapArraysDeep)
    }

    else if (ko.isWritableObservable(dest[prop])) {
      dest[prop](
        src[prop] instanceof Array && mapArraysDeep
          ? fromJS(src[prop], true)()
          : src[prop]
      )
    }

    else if (isUndefined(src[prop])) {
      dest[prop] = undefined
    }

    else if (src[prop].constructor === Object) {
      merge(dest[prop], src[prop], mapArraysDeep)
    }

    else {
      dest[prop] = src[prop]
    }
  }

  return dest
}

function isUndefined(foo) {
  return typeof foo === 'undefined'
}
