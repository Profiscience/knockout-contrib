import * as ko from 'knockout'

type ObservableTree<T> = T extends any[]
  ? ko.ObservableArray<T[number]>
  : T extends Date
    ? ko.Observable<Date>
    : T extends RegExp
      ? ko.Observable<RegExp>
      : T extends ko.Observable
        ? T
        : T extends ko.ObservableArray
          ? T
          : T extends ko.Computed
            ? T
            : T extends (...args: any[]) => any
              ? T
              : T extends { [k: string]: any }
                ? { readonly [P in keyof T]: ObservableTree<T[P]> }
                : ko.Observable<T>

export function fromJS<T>(obj: T, mapArrayElements = false): ObservableTree<T> {
  if (ko.isObservable(obj)) {
    return obj as any
  } else if (Array.isArray(obj)) {
    return ko.observableArray(
      mapArrayElements ? obj.map((v) => fromJS(v, mapArrayElements)) : obj
    ) as any
  } else if (obj instanceof Date || obj instanceof RegExp) {
    return ko.observable(obj) as any
  } else if (obj instanceof Function) {
    return obj as any
  } else if (obj instanceof Object) {
    const obs = Object.create(Object.getPrototypeOf(obj))
    for (const p of Object.keys(obj)) {
      obs[p] = fromJS((obj as any)[p], mapArrayElements)
    }
    return obs
  } else {
    return ko.observable(obj) as any
  }
}
