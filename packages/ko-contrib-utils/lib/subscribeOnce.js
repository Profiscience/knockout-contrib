(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['knockout'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('knockout'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.knockout);
    global.subscribeOnce = mod.exports;
  }
})(this, function (_knockout) {
  'use strict';

  var _knockout2 = _interopRequireDefault(_knockout);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  _knockout2.default.observable.fn.subscribeOnce = _knockout2.default.observableArray.fn.subscribeOnce = _knockout2.default.computed.fn.subscribeOnce = subscribeOnce;

  function subscribeOnce(fn) {
    var killMe = this.subscribe(function (v) {
      killMe.dispose();
      fn(v);
    });
  }
});