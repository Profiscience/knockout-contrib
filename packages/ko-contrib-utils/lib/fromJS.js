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
    global.fromJS = mod.exports;
  }
})(this, function (exports, _knockout) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = fromJS;

  var _knockout2 = _interopRequireDefault(_knockout);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function fromJS(obj, mapArraysDeep, _parentIsArray) {
    var obs = void 0;

    if (_knockout2.default.isObservable(obj)) {
      obs = obj;
    } else if (obj instanceof Array) {
      obs = [];

      for (var i = 0; i < obj.length; i++) {
        obs[i] = fromJS(obj[i], mapArraysDeep, true);
      }

      obs = _knockout2.default.observableArray(obs);
    } else if (obj && obj.constructor === Object) {
      obs = {};

      for (var p in obj) {
        obs[p] = fromJS(obj[p]);
      }
    } else {
      obs = _parentIsArray && !mapArraysDeep ? obj : _knockout2.default.observable(obj);
    }

    return obs;
  }
});