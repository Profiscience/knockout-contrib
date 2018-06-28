export function modify<T>(
  obs: ko.Observable<T> | ko.Computed<T>,
  fn: (v: T) => T
): T {
  const v = fn(obs())
  obs(v)
  return v
}
