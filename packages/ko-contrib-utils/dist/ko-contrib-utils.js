(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("knockout"));
	else if(typeof define === 'function' && define.amd)
		define(["knockout"], factory);
	else if(typeof exports === 'object')
		exports["ko-contrib-utils"] = factory(require("knockout"));
	else
		root["ko-contrib-utils"] = factory(root["ko"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _knockout = __webpack_require__(1);
	
	var _knockout2 = _interopRequireDefault(_knockout);
	
	var _defaults = __webpack_require__(2);
	
	var _defaults2 = _interopRequireDefault(_defaults);
	
	var _fromJS = __webpack_require__(3);
	
	var _fromJS2 = _interopRequireDefault(_fromJS);
	
	var _merge = __webpack_require__(4);
	
	var _merge2 = _interopRequireDefault(_merge);
	
	__webpack_require__(5);
	
	__webpack_require__(6);
	
	__webpack_require__(7);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_knockout2.default.utils.defaults = _defaults2.default;
	_knockout2.default.utils.fromJS = _fromJS2.default;
	_knockout2.default.utils.merge = _merge2.default;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = defaults;
	
	var _fromJS = __webpack_require__(3);
	
	var _fromJS2 = _interopRequireDefault(_fromJS);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
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

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = fromJS;
	
	var _knockout = __webpack_require__(1);
	
	var _knockout2 = _interopRequireDefault(_knockout);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
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

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = merge;
	
	var _knockout = __webpack_require__(1);
	
	var _knockout2 = _interopRequireDefault(_knockout);
	
	var _fromJS = __webpack_require__(3);
	
	var _fromJS2 = _interopRequireDefault(_fromJS);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
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

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _knockout = __webpack_require__(1);
	
	var _knockout2 = _interopRequireDefault(_knockout);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_knockout2.default.observable.fn.increment = _knockout2.default.computed.fn.increment = function () {
	  var amt = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
	
	  if (!_knockout2.default.isWritableObservable(this)) {
	    throw new Error('ko.computed.fn.increment requires a writable computed');
	  }
	  this(this() + amt);
	};
	
	_knockout2.default.observable.fn.decrement = _knockout2.default.computed.fn.decrement = function () {
	  var amt = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
	
	  if (!_knockout2.default.isWritableObservable(this)) {
	    throw new Error('ko.computed.fn.decrement requires a writable computed');
	  }
	  this(this() - amt);
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _knockout = __webpack_require__(1);
	
	var _knockout2 = _interopRequireDefault(_knockout);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_knockout2.default.observable.fn.subscribeOnce = _knockout2.default.observableArray.fn.subscribeOnce = _knockout2.default.computed.fn.subscribeOnce = subscribeOnce;
	
	function subscribeOnce(fn) {
	  var killMe = this.subscribe(function (v) {
	    killMe.dispose();
	    fn(v);
	  });
	}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var _knockout = __webpack_require__(1);
	
	var _knockout2 = _interopRequireDefault(_knockout);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	_knockout2.default.observable.fn.toString = function () {
	  return toString(this, 'Observable');
	};
	_knockout2.default.observableArray.fn.toString = function () {
	  return toString(this, 'ObservableArray');
	};
	_knockout2.default.computed.fn.toString = function () {
	  return toString(this, 'Computed');
	};
	
	function toString(obs, type) {
	  return type + '(' + _knockout2.default.toJSON(obs(), null) + ')';
	}

/***/ }
/******/ ])
});
;
//# sourceMappingURL=ko-contrib-utils.js.map