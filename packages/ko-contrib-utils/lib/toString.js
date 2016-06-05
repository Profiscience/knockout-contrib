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
    global.toString = mod.exports;
  }
})(this, function (_knockout) {
  'use strict';

  var _knockout2 = _interopRequireDefault(_knockout);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  _knockout2.default.observable.fn.toString = function () {
    return toString('Observable').call(this);
  };
  _knockout2.default.observableArray.fn.toString = function () {
    return toString('bservableArray').call(this);
  };
  _knockout2.default.computed.fn.toString = function () {
    return toString('Computed').call(this);
  };
  _knockout2.default.pureComputed.fn.toString = function () {
    return toString('PureComputed').call(this);
  };

  function toString(type) {
    return type + '(' + _knockout2.default.toJSON(this(), null, 2) + ')';
  }
});