import ko from 'knockout'

export default function fromJS(obj, mapArraysDeep, _parentIsArray) {
  let obs

  if (ko.isObservable(obj)) {
    obs = obj
  } else if (obj instanceof Array) {
    obs = []

    for (let i = 0; i < obj.length; i++) {
      obs[i] = fromJS(obj[i], mapArraysDeep, true)
    }

    obs = ko.observableArray(obs)
  } else if (obj instanceof Date || obj instanceof RegExp) {
    obs = ko.observable(obj)
  } else if (obj instanceof Function) {
    obs = obj
  } else if (obj instanceof Object) {
    obs = {}

    for (const p in obj) {
      obs[p] = fromJS(obj[p])
    }
  } else {
    obs = _parentIsArray && !mapArraysDeep ? obj : ko.observable(obj)
  }

  return obs
}
