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
    global.increment = mod.exports;
  }
})(this, function (_knockout) {
  'use strict';

  var _knockout2 = _interopRequireDefault(_knockout);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  _knockout2.default.observable.fn.increment = _knockout2.default.computed.fn.increment = function () {
    var amt = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

    if (!_knockout2.default.isWritableObservable(this)) {
      throw new Error('ko.computed.fn.increment requires a writable computed');
    }
    this(this() + amt);
  };

  _knockout2.default.observable.fn.decrement = _knockout2.default.computed.fn.decrement = function () {
    var amt = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

    if (!_knockout2.default.isWritableObservable(this)) {
      throw new Error('ko.computed.fn.decrement requires a writable computed');
    }
    this(this() - amt);
  };
});