import * as ko from 'knockout'

type KnockoutObservableTree<T> = T extends any[]
  ? KnockoutObservableArray<T[number]>
  : T extends Date
    ? KnockoutObservable<Date>
    : T extends RegExp
      ? KnockoutObservable<RegExp>
      : T extends KnockoutObservable<any>
        ? T
        : T extends KnockoutObservableArray<any>
          ? T
          : T extends (...args: any[]) => any
            ? T
            : T extends { [k: string]: any }
              ? { readonly [P in keyof T]: KnockoutObservableTree<T[P]> }
              : KnockoutObservable<T>

export function fromJS<T>(
  obj: T,
  mapArrayElements = false
): KnockoutObservableTree<T> {
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
