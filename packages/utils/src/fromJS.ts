import * as ko from 'knockout'
import { KnockoutObservableTree } from './_types'

export default function fromJS(
  obj: any,
  mapArraysDeep: boolean = false,
  _parentIsArray: boolean = false
): KnockoutObservable<any> | KnockoutObservableTree {
  let obs: KnockoutObservable<any> | KnockoutObservableTree

  if (ko.isObservable(obj)) {
    obs = obj
  } else if (obj instanceof Array) {
    const _arr = []
    for (let i = 0; i < obj.length; i++) {
      _arr[i] = fromJS(obj[i], mapArraysDeep, true)
    }
    obs = ko.observableArray(_arr)
  } else if (obj instanceof Date || obj instanceof RegExp) {
    obs = ko.observable(obj)
  } else if (obj instanceof Function) {
    obs = obj
  } else if (obj instanceof Object) {
    obs = {}
    for (const p in obj) {
      obs[p] = fromJS(obj[p], mapArraysDeep)
    }
  } else {
    obs = _parentIsArray && !mapArraysDeep ? obj : ko.observable(obj)
  }

  return obs
}
