(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'knockout', './cast', './defaults', './fromJS', './merge', './increment', './subscribeOnce', './toString'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('knockout'), require('./cast'), require('./defaults'), require('./fromJS'), require('./merge'), require('./increment'), require('./subscribeOnce'), require('./toString'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.knockout, global.cast, global.defaults, global.fromJS, global.merge, global.increment, global.subscribeOnce, global.functionToStringNativeCode);
    global.index = mod.exports;
  }
})(this, function (exports, _knockout, _cast, _defaults, _fromJS, _merge) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.merge = exports.fromJS = exports.defaults = exports.cast = undefined;

  var _knockout2 = _interopRequireDefault(_knockout);

  var _cast2 = _interopRequireDefault(_cast);

  var _defaults2 = _interopRequireDefault(_defaults);

  var _fromJS2 = _interopRequireDefault(_fromJS);

  var _merge2 = _interopRequireDefault(_merge);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  _knockout2.default.utils.cast = _cast2.default;
  _knockout2.default.utils.defaults = _defaults2.default;
  _knockout2.default.utils.fromJS = _fromJS2.default;
  _knockout2.default.utils.merge = _merge2.default;

  exports.cast = _cast2.default;
  exports.defaults = _defaults2.default;
  exports.fromJS = _fromJS2.default;
  exports.merge = _merge2.default;
});