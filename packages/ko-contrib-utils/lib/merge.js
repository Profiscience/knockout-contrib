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
    global.merge = mod.exports;
  }
})(this, function (exports, _knockout, _fromJS) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = merge;

  var _knockout2 = _interopRequireDefault(_knockout);

  var _fromJS2 = _interopRequireDefault(_fromJS);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function merge(dest, src, mapArraysDeep) {
    var props = Object.keys(src);

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = props[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var prop = _step.value;

        if (isUndefined(dest[prop])) {
          dest[prop] = (0, _fromJS2.default)(src[prop], src[prop] instanceof Array && mapArraysDeep);
        } else if (_knockout2.default.isWritableObservable(dest[prop])) {
          dest[prop](src[prop] instanceof Array && mapArraysDeep ? (0, _fromJS2.default)(src[prop], true)() : src[prop]);
        } else if (isUndefined(src[prop])) {
          dest[prop] = undefined;
        } else if (src[prop].constructor === Object) {
          merge(dest[prop], src[prop], mapArraysDeep);
        } else {
          dest[prop] = src[prop];
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    return dest;
  }

  function isUndefined(foo) {
    return typeof foo === 'undefined';
  }
});