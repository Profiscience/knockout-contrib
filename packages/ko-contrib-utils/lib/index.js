(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['knockout', './defaults', './fromJS', './merge', './increment', './toString'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('knockout'), require('./defaults'), require('./fromJS'), require('./merge'), require('./increment'), require('./toString'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.knockout, global.defaults, global.fromJS, global.merge, global.increment, global.functionToStringNativeCode);
    global.index = mod.exports;
  }
})(this, function (_knockout, _defaults, _fromJS, _merge) {
  'use strict';

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
});