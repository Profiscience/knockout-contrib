export function increment(
  obs: ko.Observable<number> | ko.Computed<number>,
  amt = 1
): number {
  const v = obs() + amt
  obs(v)
  return v
}

export function decrement(
  obs: ko.Observable<number> | ko.Computed<number>,
  amt = 1
): number {
  return increment(obs, -amt)
}
