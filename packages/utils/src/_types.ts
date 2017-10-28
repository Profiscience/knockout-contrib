export type PlainObject = {
  [k: string]: any
}

export type KnockoutObservableTree = {
  [k: string]: KnockoutObservableTree | KnockoutObservable<any> | KnockoutObservableArray<any>
}
