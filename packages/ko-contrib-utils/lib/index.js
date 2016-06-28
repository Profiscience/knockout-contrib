(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['exports', 'knockout', './defaults', './fromJS', './merge', './increment', './subscribeOnce', './toString'], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require('knockout'), require('./defaults'), require('./fromJS'), require('./merge'), require('./increment'), require('./subscribeOnce'), require('./toString'));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.knockout, global.defaults, global.fromJS, global.merge, global.increment, global.subscribeOnce, global.functionToStringNativeCode);
    global.index = mod.exports;
  }
})(this, function (exports, _knockout, _defaults, _fromJS, _merge) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _knockout2 = _interopRequireDefault(_knockout);

  var _defaults2 = _interopRequireDefault(_defaults);

  var _fromJS2 = _interopRequireDefault(_fromJS);

  var _merge2 = _interopRequireDefault(_merge);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  _knockout2.default.utils.defaults = _defaults2.default;
  _knockout2.default.utils.fromJS = _fromJS2.default;
  _knockout2.default.utils.merge = _merge2.default;

  exports.default = {
    defaults: _defaults2.default,
    fromJS: _fromJS2.default,
    merge: _merge2.default
  };
});