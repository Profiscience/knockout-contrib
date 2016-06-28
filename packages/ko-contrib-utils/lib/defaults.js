(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', './fromJS'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('./fromJS'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.fromJS);
    global.defaults = mod.exports;
  }
})(this, function (exports, _fromJS) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = defaults;

  var _fromJS2 = _interopRequireDefault(_fromJS);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function defaults(dest, defaults, mapArraysDeep) {
    for (var prop in defaults) {
      if (isUndefined(dest[prop])) {
        dest[prop] = (0, _fromJS2.default)(defaults[prop], defaults[prop] instanceof Array && mapArraysDeep);
      }
    }

    return dest;
  }

  function isUndefined(foo) {
    return typeof foo === 'undefined';
  }
});