(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'knockout', './fromJS'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('knockout'), require('./fromJS'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.knockout, global.fromJS);
    global.defaults = mod.exports;
  }
})(this, function (exports, _knockout, _fromJS) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (dest, src, mapArrays) {
    for (var prop in src) {
      if (isUndefined(src[prop]) || src[prop] === null) {
        if (isUndefined(dest[src])) {
          dest[prop] = _knockout2.default.observable(src[prop]);
        } else if (_knockout2.default.isWritableObservable(dest[prop])) {
          dest[prop](src[prop]);
        } else {
          dest[prop] = src[prop];
        }
      } else if (isUndefined(dest[prop])) {
        dest[prop] = (0, _fromJS2.default)(src[prop], src[prop] instanceof Array && mapArrays);
      }
    }

    return dest;
  };

  var _knockout2 = _interopRequireDefault(_knockout);

  var _fromJS2 = _interopRequireDefault(_fromJS);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function isUndefined(foo) {
    return typeof foo === 'undefined';
  }
});