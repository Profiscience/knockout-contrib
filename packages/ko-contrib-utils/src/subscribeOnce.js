import ko from 'knockout'

ko.observable.fn.subscribeOnce =
ko.observableArray.fn.subscribeOnce =
ko.computed.fn.subscribeOnce =
  function(fn) {
    return subscribeOnce(this, fn) 
  }

export default function subscribeOnce(obs, fn) {
  const killMe = obs.subscribe((v) => {
    killMe.dispose()
    fn(v)
  })
  return killMe
}
