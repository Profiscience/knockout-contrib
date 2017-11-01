import * as ko from 'knockout'

// declare global {
//   interface KnockoutObservableTree<T> {
//     [k: string]: Function | KnockoutObservable<T> | KnockoutObservableTree<T>
//   }
// }

type KnockoutObservableTree<T> = {
    [P in keyof T]: KnockoutObservableTree<T[P]> | KnockoutObservable<T[P]> | KnockoutObservableArray<T[P]>
}

export default function fromJS<T extends { [k: string]: any }>(obj: T, mapArraysDeep?: boolean, _parentIsArray?: boolean): KnockoutObservableTree<T> 
export default function fromJS(obj, mapArraysDeep = false, _parentIsArray = false) {
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
    obs = obj
  } else if (obj instanceof Object) {
    const obs = {}
    for (const p in obj as { [k: string]: P }) {
      obs[p] = fromJS(obj[p], mapArraysDeep)
    }
    return obs
  } else {
    return _parentIsArray && !mapArraysDeep ? obj : ko.observable(obj)
  }
}

const f = fromJS({ foo: 'foo', bar: false, baz: 1, qux: { foo: 'foo', bar: false, baz: 1 } })

// const foo: KnockoutObservable<string> = f.foo
const bar: boolean = f.bar()
const baz: number = f.baz()

const foo: string = <KnockoutObservable<string>>f.foo()