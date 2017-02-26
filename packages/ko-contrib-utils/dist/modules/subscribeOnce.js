import ko from 'knockout';

ko.observable.fn.subscribeOnce = ko.observableArray.fn.subscribeOnce = ko.computed.fn.subscribeOnce = function (fn) {
  return subscribeOnce(this, fn);
};

export default function subscribeOnce(obs, fn) {
  var killMe = obs.subscribe(function (v) {
    killMe.dispose();
    fn(v);
  });
  return killMe;
}