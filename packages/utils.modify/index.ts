export function modify<T>(
  obs: KnockoutObservable<T> | KnockoutComputed<T>,
  fn: (v: T) => T
): T {
  const v = fn(obs())
  obs(v)
  return v
}
