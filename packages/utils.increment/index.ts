export function increment(obs: KnockoutObservable<number>, amt = 1): number {
  const v = obs() + amt
  obs(v)
  return v
}

export function decrement(obs: KnockoutObservable<number>, amt = 1): number {
  return increment(obs, -amt)
}
