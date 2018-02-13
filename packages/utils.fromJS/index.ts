import * as ko from 'knockout'

// can't accurately type this without conditional mapped types
// see: https://github.com/Microsoft/TypeScript/issues/12424
export default function fromJS(obj: { [k: string]: any }, mapArraysDeep = false, _parentIsArray = false): any {
  if (ko.isObservable(obj)) {
    return obj
  } else if (obj instanceof Array) {
    const _arr = []
    for (let i = 0; i < obj.length; i++) {
      _arr[i] = fromJS(obj[i], mapArraysDeep, true)
    }
    return ko.observableArray(_arr)
  } else if (obj instanceof Date || obj instanceof RegExp) {
    return ko.observable(obj)
  } else if (obj instanceof Function) {
    return obj
  } else if (obj instanceof Object) {
    const obs = Object.create(Object.getPrototypeOf(obj))
    for (const p of Object.keys(obj)) {
      obs[p] = fromJS(obj[p], mapArraysDeep)
    }
    return obs
  } else {
    return _parentIsArray && !mapArraysDeep ? obj : ko.observable(obj)
  }
}
