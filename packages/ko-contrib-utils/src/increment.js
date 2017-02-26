import ko from 'knockout'

ko.observable.fn.increment =
ko.computed.fn.increment =
  function(amt) {
    return increment(this, amt) 
  }

export default function increment(obs, amt = 1) {
  if (!ko.isWritableObservable(obs)) {
    throw new Error('ko.computed.fn.increment requires a writable computed')
  }
  return obs(obs() + amt)
}
