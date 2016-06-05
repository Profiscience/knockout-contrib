(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("knockout"));
	else if(typeof define === 'function' && define.amd)
		define(["knockout"], factory);
	else if(typeof exports === 'object')
		exports["ko-contrib-utils"] = factory(require("knockout"));
	else
		root["ko-contrib-utils"] = factory(root["ko"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _defaults = __webpack_require__(1);

	var _defaults2 = _interopRequireDefault(_defaults);

	var _fromJS = __webpack_require__(3);

	var _fromJS2 = _interopRequireDefault(_fromJS);

	var _merge = __webpack_require__(4);

	var _merge2 = _interopRequireDefault(_merge);

	__webpack_require__(5);

	__webpack_require__(6);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	(0, _merge2.default)(ko.utils, {
	  defaults: _defaults2.default,
	  fromJS: _fromJS2.default
	});

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

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

	var _knockout = __webpack_require__(2);

	var _knockout2 = _interopRequireDefault(_knockout);

	var _fromJS = __webpack_require__(3);

	var _fromJS2 = _interopRequireDefault(_fromJS);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function isUndefined(foo) {
	  return typeof foo === 'undefined';
	}

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = fromJS;

	var _knockout = __webpack_require__(2);

	var _knockout2 = _interopRequireDefault(_knockout);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function fromJS(obj, mapArrays, bare) {
	  var obs = void 0;

	  if (_knockout2.default.isObservable(obj)) {
	    obs = obj;
	  } else if (isPrimitiveOrDate(obj)) {
	    obs = bare ? obj : _knockout2.default.observable(obj);
	  } else if (obj instanceof Array) {
	    obs = [];

	    for (var i = 0; i < obj.length; i++) {
	      obs[i] = fromJS(obj[i], mapArrays, mapArrays !== true);
	    }obs = _knockout2.default.observableArray(obs);
	  } else if (obj.constructor === Object) {
	    obs = {};

	    for (var p in obj) {
	      obs[p] = fromJS(obj[p]);
	    }
	  }

	  return obs;
	}

	function isPrimitiveOrDate(obj) {
	  return obj === null || obj === undefined || obj.constructor === String || obj.constructor === Number || obj.constructor === Boolean || obj instanceof Date;
	}

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = merge;

	var _knockout = __webpack_require__(2);

	var _knockout2 = _interopRequireDefault(_knockout);

	var _fromJS = __webpack_require__(3);

	var _fromJS2 = _interopRequireDefault(_fromJS);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function merge(dest, src, mapArrays) {
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
	    } else if (_knockout2.default.isWritableObservable(dest[prop])) {
	      dest[prop](_knockout2.default.unwrap(src[prop] instanceof Array && mapArrays ? (0, _fromJS2.default)(src[prop], true) : src[prop]));
	    } else if (src[prop].constructor === Object) {
	      merge(dest[prop], src[prop], mapArrays);
	    } else {
	      dest[prop] = src[prop];
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

	var _knockout = __webpack_require__(2);

	var _knockout2 = _interopRequireDefault(_knockout);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_knockout2.default.observable.fn.increment = function () {
	  var amt = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

	  this(this() + amt);
	};

	_knockout2.default.observable.fn.decrement = function () {
	  var amt = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];

	  this(this() - amt);
	};

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _knockout = __webpack_require__(2);

	var _knockout2 = _interopRequireDefault(_knockout);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_knockout2.default.observable.fn.toString = function () {
	  return toString('Observable').call(this);
	};
	_knockout2.default.observableArray.fn.toString = function () {
	  return toString('bservableArray').call(this);
	};
	_knockout2.default.computed.fn.toString = function () {
	  return toString('Computed').call(this);
	};
	_knockout2.default.pureComputed.fn.toString = function () {
	  return toString('PureComputed').call(this);
	};

	function toString(type) {
	  return type + '(' + _knockout2.default.toJSON(this(), null, 2) + ')';
	}

/***/ }
/******/ ])
});
;