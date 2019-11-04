export type Unwrapped<T> = T extends ko.Subscribable<infer R>
  ? R
  : T extends Record<any, any>
  ? { [P in keyof T]: Unwrapped<T[P]> }
  : T
