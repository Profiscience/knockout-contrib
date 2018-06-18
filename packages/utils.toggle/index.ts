export function toggle(obs: KnockoutObservable<boolean>): boolean {
  const orig = obs()
  const v = !orig
  if (typeof orig !== 'boolean') {
    throw new Error(
      `[@profiscience/knockout-contrib/utils.toggle]: Can only toggle boolean observables (type is ${typeof orig}`
    )
  }
  obs(v)
  return v
}
