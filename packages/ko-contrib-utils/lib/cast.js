(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'knockout'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('knockout'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.knockout);
    global.cast = mod.exports;
  }
})(this, function (exports, _knockout) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = cast;

  var _knockout2 = _interopRequireDefault(_knockout);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function cast(src, defaultValue) {
    if (isUndefined(src)) {
      src = _knockout2.default.observable();
    }

    if (isUndefined(src()) && defaultValue) {
      src(defaultValue);
    }

    return src;
  }

  function isUndefined(foo) {
    return typeof foo === 'undefined';
  }
});