export function toggle(
  obs: KnockoutObservable<boolean> | KnockoutComputed<boolean>
): boolean {
  const orig = obs()
  const v = !orig
  if (typeof (orig as any) !== 'boolean') {
    throw new Error(
      `[@profiscience/knockout-contrib/utils.toggle]: Can only toggle boolean observables (type is ${typeof orig}`
    )
  }
  obs(v)
  return v
}
