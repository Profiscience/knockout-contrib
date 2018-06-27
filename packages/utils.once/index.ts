export function once<T>(
  obs: ko.Observable<T> | ko.Computed<T>,
  fn: (v: T) => void
): ko.Subscription {
  const killMe = obs.subscribe((v) => {
    killMe.dispose()
    fn(v)
  })
  return killMe
}
