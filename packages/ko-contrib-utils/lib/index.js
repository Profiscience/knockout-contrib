(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(['./defaults', './fromJS', './merge', './increment', './toString'], factory);
  } else if (typeof exports !== "undefined") {
    factory(require('./defaults'), require('./fromJS'), require('./merge'), require('./increment'), require('./toString'));
  } else {
    var mod = {
      exports: {}
    };
    factory(global.defaults, global.fromJS, global.merge, global.increment, global.functionToStringNativeCode);
    global.index = mod.exports;
  }
})(this, function (_defaults, _fromJS, _merge) {
  'use strict';

  var _defaults2 = _interopRequireDefault(_defaults);

  var _fromJS2 = _interopRequireDefault(_fromJS);

  var _merge2 = _interopRequireDefault(_merge);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  (0, _merge2.default)(ko.utils, {
    defaults: _defaults2.default,
    fromJS: _fromJS2.default
  });
});