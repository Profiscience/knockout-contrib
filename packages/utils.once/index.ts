export function once<T>(
  obs: KnockoutObservable<T> | KnockoutComputed<T>,
  fn: (v: T) => void
): KnockoutSubscription {
  const killMe = obs.subscribe((v) => {
    killMe.dispose()
    fn(v)
  })
  return killMe
}
