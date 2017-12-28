webpackJsonp([5,10,11,21,22,23],{

/***/ 222:
/***/ (function(module, exports) {

module.exports = "<h1>foo</h1>\n\n<hr>\n\n<a data-bind=\"path: '//bar'\">go to bar</a>\n";

/***/ }),

/***/ 223:
/***/ (function(module, exports) {

module.exports = "<h1>bar</h1>\n\n<hr>\n\n<a data-bind=\"path: '//foo'\">go to foo</a>\n";

/***/ }),

/***/ 230:
/***/ (function(module, exports) {

module.exports = "\n<style>\n  .overlay-loader {\n    position: fixed;\n    top: 0;\n    left: 0;\n    height: 100%;\n    width: 100%;\n    background: rgba(255,255,255,.8);\n    z-index: 999;\n  }\n\n  .overlay-loader-inner {\n    transform: translateY(-50%);\n    top: 50%;\n    position: absolute;\n    width: 100%;\n    color: #FFF;\n    text-align: center;\n  }\n\n  .overlay-loader-inner label {\n    font-size: 20px;\n    opacity: 0;\n    display: inline-block;\n    color: #81b5ec;\n  }\n\n  @keyframes lol {\n    0% {\n      opacity: 0;\n      transform: translateX(-300px);\n    }\n    50% {\n      opacity: 1;\n      transform: translateX(0px);\n    }\n    100% {\n      opacity: 0;\n      transform: translateX(300px);\n    }\n  }\n\n  .overlay-loader-inner label:nth-child(6) {\n    animation: lol 2s infinite ease-in-out;\n  }\n\n  .overlay-loader-inner label:nth-child(5) {\n    animation: lol 2s 100ms infinite ease-in-out;\n  }\n\n  .overlay-loader-inner label:nth-child(4) {\n    animation: lol 2s 200ms infinite ease-in-out;\n  }\n\n  .overlay-loader-inner label:nth-child(3) {\n    animation: lol 2s 300ms infinite ease-in-out;\n  }\n\n  .overlay-loader-inner label:nth-child(2) {\n    animation: lol 2s 400ms infinite ease-in-out;\n  }\n\n  .overlay-loader-inner label:nth-child(1) {\n    animation: lol 2s 500ms infinite ease-in-out;\n  }\n</style>\n\n<div class=\"overlay-loader\" data-bind=\"visible: isLoading\">\n  <div class=\"overlay-loader-inner\">\n    <label>&#9679;</label>\n    <label>&#9679;</label>\n    <label>&#9679;</label>\n    <label>&#9679;</label>\n    <label>&#9679;</label>\n    <label>&#9679;</label>\n  </div>\n</div>\n\n<router></router>";

/***/ }),

/***/ 236:
/***/ (function(module, exports) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
}
module.exports = isObject;


/***/ }),

/***/ 237:
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(238), getRawTag = __webpack_require__(248), objectToString = __webpack_require__(249);
/** `Object#toString` result references. */
var nullTag = '[object Null]', undefinedTag = '[object Undefined]';
/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;
/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
    if (value == null) {
        return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag && symToStringTag in Object(value))
        ? getRawTag(value)
        : objectToString(value);
}
module.exports = baseGetTag;


/***/ }),

/***/ 238:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var root = __webpack_require__(246);
/** Built-in value references. */
var Symbol = root.Symbol;
module.exports = Symbol;


/***/ }),

/***/ 240:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var baseRandom = __webpack_require__(241), isIterateeCall = __webpack_require__(242), toFinite = __webpack_require__(252);
/** Built-in method references without a dependency on `root`. */
var freeParseFloat = parseFloat;
/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min, nativeRandom = Math.random;
/**
 * Produces a random number between the inclusive `lower` and `upper` bounds.
 * If only one argument is provided a number between `0` and the given number
 * is returned. If `floating` is `true`, or either `lower` or `upper` are
 * floats, a floating-point number is returned instead of an integer.
 *
 * **Note:** JavaScript follows the IEEE-754 standard for resolving
 * floating-point values which can produce unexpected results.
 *
 * @static
 * @memberOf _
 * @since 0.7.0
 * @category Number
 * @param {number} [lower=0] The lower bound.
 * @param {number} [upper=1] The upper bound.
 * @param {boolean} [floating] Specify returning a floating-point number.
 * @returns {number} Returns the random number.
 * @example
 *
 * _.random(0, 5);
 * // => an integer between 0 and 5
 *
 * _.random(5);
 * // => also an integer between 0 and 5
 *
 * _.random(5, true);
 * // => a floating-point number between 0 and 5
 *
 * _.random(1.2, 5.2);
 * // => a floating-point number between 1.2 and 5.2
 */
function random(lower, upper, floating) {
    if (floating && typeof floating != 'boolean' && isIterateeCall(lower, upper, floating)) {
        upper = floating = undefined;
    }
    if (floating === undefined) {
        if (typeof upper == 'boolean') {
            floating = upper;
            upper = undefined;
        }
        else if (typeof lower == 'boolean') {
            floating = lower;
            lower = undefined;
        }
    }
    if (lower === undefined && upper === undefined) {
        lower = 0;
        upper = 1;
    }
    else {
        lower = toFinite(lower);
        if (upper === undefined) {
            upper = lower;
            lower = 0;
        }
        else {
            upper = toFinite(upper);
        }
    }
    if (lower > upper) {
        var temp = lower;
        lower = upper;
        upper = temp;
    }
    if (floating || lower % 1 || upper % 1) {
        var rand = nativeRandom();
        return nativeMin(lower + (rand * (upper - lower + freeParseFloat('1e-' + ((rand + '').length - 1)))), upper);
    }
    return baseRandom(lower, upper);
}
module.exports = random;


/***/ }),

/***/ 241:
/***/ (function(module, exports) {

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeFloor = Math.floor, nativeRandom = Math.random;
/**
 * The base implementation of `_.random` without support for returning
 * floating-point numbers.
 *
 * @private
 * @param {number} lower The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the random number.
 */
function baseRandom(lower, upper) {
    return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
}
module.exports = baseRandom;


/***/ }),

/***/ 242:
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(243), isArrayLike = __webpack_require__(244), isIndex = __webpack_require__(251), isObject = __webpack_require__(236);
/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
    if (!isObject(object)) {
        return false;
    }
    var type = typeof index;
    if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)) {
        return eq(object[index], value);
    }
    return false;
}
module.exports = isIterateeCall;


/***/ }),

/***/ 243:
/***/ (function(module, exports) {

/**
 * Performs a
 * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'a': 1 };
 * var other = { 'a': 1 };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
    return value === other || (value !== value && other !== other);
}
module.exports = eq;


/***/ }),

/***/ 244:
/***/ (function(module, exports, __webpack_require__) {

var isFunction = __webpack_require__(245), isLength = __webpack_require__(250);
/**
 * Checks if `value` is array-like. A value is considered array-like if it's
 * not a function and has a `value.length` that's an integer greater than or
 * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
 * @example
 *
 * _.isArrayLike([1, 2, 3]);
 * // => true
 *
 * _.isArrayLike(document.body.children);
 * // => true
 *
 * _.isArrayLike('abc');
 * // => true
 *
 * _.isArrayLike(_.noop);
 * // => false
 */
function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
}
module.exports = isArrayLike;


/***/ }),

/***/ 245:
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(237), isObject = __webpack_require__(236);
/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]', funcTag = '[object Function]', genTag = '[object GeneratorFunction]', proxyTag = '[object Proxy]';
/**
 * Checks if `value` is classified as a `Function` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a function, else `false`.
 * @example
 *
 * _.isFunction(_);
 * // => true
 *
 * _.isFunction(/abc/);
 * // => false
 */
function isFunction(value) {
    if (!isObject(value)) {
        return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}
module.exports = isFunction;


/***/ }),

/***/ 246:
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(247);
/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;
/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();
module.exports = root;


/***/ }),

/***/ 247:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;
module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(90)))

/***/ }),

/***/ 248:
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(238);
/** Used for built-in method references. */
var objectProto = Object.prototype;
/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;
/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;
/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
    try {
        value[symToStringTag] = undefined;
        var unmasked = true;
    }
    catch (e) { }
    var result = nativeObjectToString.call(value);
    if (unmasked) {
        if (isOwn) {
            value[symToStringTag] = tag;
        }
        else {
            delete value[symToStringTag];
        }
    }
    return result;
}
module.exports = getRawTag;


/***/ }),

/***/ 249:
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;
/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;
/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
    return nativeObjectToString.call(value);
}
module.exports = objectToString;


/***/ }),

/***/ 250:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;
/**
 * Checks if `value` is a valid array-like length.
 *
 * **Note:** This method is loosely based on
 * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
 * @example
 *
 * _.isLength(3);
 * // => true
 *
 * _.isLength(Number.MIN_VALUE);
 * // => false
 *
 * _.isLength(Infinity);
 * // => false
 *
 * _.isLength('3');
 * // => false
 */
function isLength(value) {
    return typeof value == 'number' &&
        value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
}
module.exports = isLength;


/***/ }),

/***/ 251:
/***/ (function(module, exports) {

/** Used as references for various `Number` constants. */
var MAX_SAFE_INTEGER = 9007199254740991;
/** Used to detect unsigned integer values. */
var reIsUint = /^(?:0|[1-9]\d*)$/;
/**
 * Checks if `value` is a valid array-like index.
 *
 * @private
 * @param {*} value The value to check.
 * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
 * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
 */
function isIndex(value, length) {
    length = length == null ? MAX_SAFE_INTEGER : length;
    return !!length &&
        (typeof value == 'number' || reIsUint.test(value)) &&
        (value > -1 && value % 1 == 0 && value < length);
}
module.exports = isIndex;


/***/ }),

/***/ 252:
/***/ (function(module, exports, __webpack_require__) {

var toNumber = __webpack_require__(253);
/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0, MAX_INTEGER = 1.7976931348623157e+308;
/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
    if (!value) {
        return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY || value === -INFINITY) {
        var sign = (value < 0 ? -1 : 1);
        return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
}
module.exports = toFinite;


/***/ }),

/***/ 253:
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(236), isSymbol = __webpack_require__(254);
/** Used as references for various `Number` constants. */
var NAN = 0 / 0;
/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;
/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;
/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;
/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;
/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
    if (typeof value == 'number') {
        return value;
    }
    if (isSymbol(value)) {
        return NAN;
    }
    if (isObject(value)) {
        var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
        value = isObject(other) ? (other + '') : other;
    }
    if (typeof value != 'string') {
        return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, '');
    var isBinary = reIsBinary.test(value);
    return (isBinary || reIsOctal.test(value))
        ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
        : (reIsBadHex.test(value) ? NAN : +value);
}
module.exports = toNumber;


/***/ }),

/***/ 254:
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(237), isObjectLike = __webpack_require__(255);
/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';
/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
    return typeof value == 'symbol' ||
        (isObjectLike(value) && baseGetTag(value) == symbolTag);
}
module.exports = isSymbol;


/***/ }),

/***/ 255:
/***/ (function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
    return value != null && typeof value == 'object';
}
module.exports = isObjectLike;


/***/ }),

/***/ 256:
/***/ (function(module, exports) {

/*
** ToProgress v0.1.1
** http://github.com/djyde/ToProgress
*/
// Animation Detection
function whichTransitionEvent() {
    var t, el = document.createElement("fakeelement");
    var transitions = {
        "transition": "transitionend",
        "OTransition": "oTransitionEnd",
        "MozTransition": "transitionend",
        "WebkitTransition": "webkitTransitionEnd"
    };
    for (t in transitions) {
        if (el.style[t] !== undefined) {
            return transitions[t];
        }
    }
}
var transitionEvent = whichTransitionEvent();
var ToProgress = function (opt, selector) {
    // Attributes
    var that = this;
    this.progress = 0;
    this.options = {
        id: 'top-progress-bar',
        color: '#F44336',
        height: '2px',
        duration: 0.2,
        position: 'top'
    };
    if (opt && typeof opt === 'object') {
        for (var key in opt) {
            this.options[key] = opt[key];
        }
    }
    this.options.opacityDuration = this.options.duration * 3;
    this.progressBar = document.createElement('div');
    // Initialization
    this.progressBar.id = this.options.id;
    this.progressBar.setCSS = function (style) {
        for (var property in style) {
            this.style[property] = style[property];
        }
    };
    this.progressBar.setCSS({
        "position": selector ? "relative" : "fixed",
        "top": this.options.position === 'top' ? "0" : 'auto',
        "bottom": this.options.position === 'bottom' ? "0" : 'auto',
        "left": "0",
        "right": "0",
        "background-color": this.options.color,
        "height": this.options.height,
        "width": "0%",
        "transition": "width " + this.options.duration + "s" + ", opacity " + this.options.opacityDuration + "s",
        "-moz-transition": "width " + this.options.duration + "s" + ", opacity " + this.options.opacityDuration + "s",
        "-webkit-transition": "width " + this.options.duration + "s" + ", opacity " + this.options.opacityDuration + "s"
    });
    // Create the Progress Bar
    if (selector) {
        var el = document.querySelector(selector);
        if (el) {
            if (el.hasChildNodes()) {
                el.insertBefore(this.progressBar, el.firstChild);
            }
            else {
                el.appendChild(this.progressBar);
            }
        }
    }
    else {
        document.body.appendChild(this.progressBar);
    }
};
ToProgress.prototype.transit = function () {
    this.progressBar.style.width = this.progress + '%';
};
ToProgress.prototype.getProgress = function () {
    return this.progress;
};
ToProgress.prototype.setProgress = function (progress, callback) {
    this.show();
    if (progress > 100) {
        this.progress = 100;
    }
    else if (progress < 0) {
        this.progress = 0;
    }
    else {
        this.progress = progress;
    }
    this.transit();
    callback && callback();
};
ToProgress.prototype.increase = function (toBeIncreasedProgress, callback) {
    this.show();
    this.setProgress(this.progress + toBeIncreasedProgress, callback);
};
ToProgress.prototype.decrease = function (toBeDecreasedProgress, callback) {
    this.show();
    this.setProgress(this.progress - toBeDecreasedProgress, callback);
};
ToProgress.prototype.finish = function (callback) {
    var that = this;
    this.setProgress(100, callback);
    this.hide();
    transitionEvent && this.progressBar.addEventListener(transitionEvent, function (e) {
        that.reset();
        that.progressBar.removeEventListener(e.type, arguments.callee);
    });
};
ToProgress.prototype.reset = function (callback) {
    this.progress = 0;
    this.transit();
    callback && callback();
};
ToProgress.prototype.hide = function () {
    this.progressBar.style.opacity = '0';
};
ToProgress.prototype.show = function () {
    this.progressBar.style.opacity = '1';
};
module.exports = ToProgress;


/***/ }),

/***/ 29:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__template_html__ = __webpack_require__(222);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__template_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__template_html__);


__WEBPACK_IMPORTED_MODULE_0_knockout__["components"].register('foo', { template: __WEBPACK_IMPORTED_MODULE_1__template_html___default.a });


/***/ }),

/***/ 30:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__template_html__ = __webpack_require__(223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__template_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__template_html__);


__WEBPACK_IMPORTED_MODULE_0_knockout__["components"].register('bar', { template: __WEBPACK_IMPORTED_MODULE_1__template_html___default.a });


/***/ }),

/***/ 32:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_random__ = __webpack_require__(240);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_random___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_random__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_knockout__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_toprogress__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_toprogress___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_toprogress__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__profiscience_knockout_contrib_router__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__views_foo__ = __webpack_require__(29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__views_bar__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__index_html__ = __webpack_require__(230);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__index_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__index_html__);








function createLoadingMiddleware(isLoading) {
    var loadingBar;
    var loadingBarInterval;
    return function (ctx) {
        return __WEBPACK_IMPORTED_MODULE_0_tslib__["g" /* __generator */](this, function (_a) {
            switch (_a.label) {
                case 0:
                    // run once for top-most router
                    if (!loadingBar) {
                        // toggle overlay (observable passed in)
                        LOADING(true);
                        // start loading bar
                        loadingBar = new __WEBPACK_IMPORTED_MODULE_3_toprogress__({
                            color: '#000',
                            duration: 0.2,
                            height: '5px'
                        });
                        loadingBarInterval = setInterval(function () {
                            loadingBar.increase(1);
                        }, 100);
                    }
                    return [4 /*yield*/];
                case 1:
                    _a.sent();
                    // end loading in bottom-most router afterRender
                    if (!ctx.$child) {
                        loadingBar.finish();
                        clearInterval(loadingBarInterval);
                        LOADING(false);
                        // reset for next navigation
                        loadingBar = null;
                        loadingBarInterval = null;
                    }
                    return [2 /*return*/];
            }
        });
    };
}
var LOADING = __WEBPACK_IMPORTED_MODULE_2_knockout__["observable"](true);
// pass loading observable into middleware factory
__WEBPACK_IMPORTED_MODULE_4__profiscience_knockout_contrib_router__["a" /* Router */].use(createLoadingMiddleware(LOADING));
__WEBPACK_IMPORTED_MODULE_4__profiscience_knockout_contrib_router__["a" /* Router */].useRoutes({
    '/': function (ctx) { return ctx.redirect('/foo'); },
    // simulate a deeply nested route w/ timeouts (would be ajax or what have you
    // in real life)
    '/foo': [
        randomTimeout,
        {
            '/': [
                randomTimeout,
                {
                    '/': [
                        randomTimeout,
                        {
                            '/': [
                                randomTimeout,
                                {
                                    '/': [
                                        randomTimeout,
                                        {
                                            '/': 'foo'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ],
    '/bar': 'bar'
});
var ViewModel = /** @class */ (function () {
    function ViewModel() {
        this.isLoading = LOADING;
    }
    return ViewModel;
}());
function randomTimeout() {
    return __WEBPACK_IMPORTED_MODULE_0_tslib__["e" /* __awaiter */](this, void 0, void 0, function () {
        return __WEBPACK_IMPORTED_MODULE_0_tslib__["g" /* __generator */](this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, __WEBPACK_IMPORTED_MODULE_1_lodash_random___default()(1000)); })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
__WEBPACK_IMPORTED_MODULE_2_knockout__["components"].register('loading-animation', { viewModel: ViewModel, template: __WEBPACK_IMPORTED_MODULE_7__index_html___default.a });


/***/ })

});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wYWNrYWdlcy9yb3V0ZXIvZXhhbXBsZXMvbG9hZGluZy1hbmltYXRpb24vdmlld3MvZm9vL3RlbXBsYXRlLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vcGFja2FnZXMvcm91dGVyL2V4YW1wbGVzL2xvYWRpbmctYW5pbWF0aW9uL3ZpZXdzL2Jhci90ZW1wbGF0ZS5odG1sIiwid2VicGFjazovLy8uL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9sb2FkaW5nLWFuaW1hdGlvbi9pbmRleC5odG1sIiwid2VicGFjazovLy8uL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0LmpzIiwid2VicGFjazovLy8uL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0VGFnLmpzIiwid2VicGFjazovLy8uL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL19TeW1ib2wuanMiLCJ3ZWJwYWNrOi8vLy4vcGFja2FnZXMvcm91dGVyL2V4YW1wbGVzL25vZGVfbW9kdWxlcy9sb2Rhc2gvcmFuZG9tLmpzIiwid2VicGFjazovLy8uL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlUmFuZG9tLmpzIiwid2VicGFjazovLy8uL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL19pc0l0ZXJhdGVlQ2FsbC5qcyIsIndlYnBhY2s6Ly8vLi9wYWNrYWdlcy9yb3V0ZXIvZXhhbXBsZXMvbm9kZV9tb2R1bGVzL2xvZGFzaC9lcS5qcyIsIndlYnBhY2s6Ly8vLi9wYWNrYWdlcy9yb3V0ZXIvZXhhbXBsZXMvbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5TGlrZS5qcyIsIndlYnBhY2s6Ly8vLi9wYWNrYWdlcy9yb3V0ZXIvZXhhbXBsZXMvbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0Z1bmN0aW9uLmpzIiwid2VicGFjazovLy8uL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL19yb290LmpzIiwid2VicGFjazovLy8uL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL19mcmVlR2xvYmFsLmpzIiwid2VicGFjazovLy8uL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRSYXdUYWcuanMiLCJ3ZWJwYWNrOi8vLy4vcGFja2FnZXMvcm91dGVyL2V4YW1wbGVzL25vZGVfbW9kdWxlcy9sb2Rhc2gvX29iamVjdFRvU3RyaW5nLmpzIiwid2VicGFjazovLy8uL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL2lzTGVuZ3RoLmpzIiwid2VicGFjazovLy8uL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL19pc0luZGV4LmpzIiwid2VicGFjazovLy8uL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL3RvRmluaXRlLmpzIiwid2VicGFjazovLy8uL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL3RvTnVtYmVyLmpzIiwid2VicGFjazovLy8uL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL2lzU3ltYm9sLmpzIiwid2VicGFjazovLy8uL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0TGlrZS5qcyIsIndlYnBhY2s6Ly8vLi9wYWNrYWdlcy9yb3V0ZXIvZXhhbXBsZXMvbm9kZV9tb2R1bGVzL3RvcHJvZ3Jlc3MvbGliL3RvcHJvZ3Jlc3MuanMiLCJ3ZWJwYWNrOi8vLy4vcGFja2FnZXMvcm91dGVyL2V4YW1wbGVzL2xvYWRpbmctYW5pbWF0aW9uL3ZpZXdzL2Zvby9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9wYWNrYWdlcy9yb3V0ZXIvZXhhbXBsZXMvbG9hZGluZy1hbmltYXRpb24vdmlld3MvYmFyL2luZGV4LnRzIiwid2VicGFjazovLy8uL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9sb2FkaW5nLWFuaW1hdGlvbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDBGOzs7Ozs7O0FDQUEsMEY7Ozs7Ozs7QUNBQSxnREFBZ0Qsc0JBQXNCLGFBQWEsY0FBYyxtQkFBbUIsa0JBQWtCLHVDQUF1QyxtQkFBbUIsS0FBSyw2QkFBNkIsa0NBQWtDLGVBQWUseUJBQXlCLGtCQUFrQixrQkFBa0IseUJBQXlCLEtBQUssbUNBQW1DLHNCQUFzQixpQkFBaUIsNEJBQTRCLHFCQUFxQixLQUFLLHNCQUFzQixVQUFVLG1CQUFtQixzQ0FBc0MsT0FBTyxXQUFXLG1CQUFtQixtQ0FBbUMsT0FBTyxZQUFZLG1CQUFtQixxQ0FBcUMsT0FBTyxLQUFLLGdEQUFnRCw2Q0FBNkMsS0FBSyxnREFBZ0QsbURBQW1ELEtBQUssZ0RBQWdELG1EQUFtRCxLQUFLLGdEQUFnRCxtREFBbUQsS0FBSyxnREFBZ0QsbURBQW1ELEtBQUssZ0RBQWdELG1EQUFtRCxLQUFLLHlJQUF5SSw0QkFBNEIsNEJBQTRCLDRCQUE0Qiw0QkFBNEIsNEJBQTRCLGlEOzs7Ozs7O0FDQXJtRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBQ0gsa0JBQWtCLEtBQUs7SUFDckIsSUFBSSxJQUFJLEdBQUcsT0FBTyxLQUFLLENBQUM7SUFDeEIsTUFBTSxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksUUFBUSxJQUFJLElBQUksSUFBSSxVQUFVLENBQUMsQ0FBQztBQUNuRSxDQUFDO0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRyxRQUFRLENBQUM7Ozs7Ozs7O0FDOUIxQixJQUFJLE1BQU0sR0FBRyxtQkFBTyxDQUFDLEdBQVcsQ0FBQyxFQUM3QixTQUFTLEdBQUcsbUJB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QUFFRDs7Ozt3QkFDRSxxQkFBTSxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sSUFBSyxpQkFBVSxDQUFDLE9BQU8sRUFBRSxxREFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQWpDLENBQWlDLENBQUM7O29CQUFqRSxTQUFpRTs7Ozs7Q0FDbEU7QUFFRCxvREFBYSxDQUFDLFFBQVEsQ0FBQyxtQkFBbUIsRUFBRSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsUUFBUSx1REFBRSxDQUFDIiwiZmlsZSI6IjUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUuZXhwb3J0cyA9IFwiPGgxPmZvbzwvaDE+XFxuXFxuPGhyPlxcblxcbjxhIGRhdGEtYmluZD1cXFwicGF0aDogJy8vYmFyJ1xcXCI+Z28gdG8gYmFyPC9hPlxcblwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcGFja2FnZXMvcm91dGVyL2V4YW1wbGVzL2xvYWRpbmctYW5pbWF0aW9uL3ZpZXdzL2Zvby90ZW1wbGF0ZS5odG1sXG4vLyBtb2R1bGUgaWQgPSAyMjJcbi8vIG1vZHVsZSBjaHVua3MgPSA1IDEwIDIxIiwibW9kdWxlLmV4cG9ydHMgPSBcIjxoMT5iYXI8L2gxPlxcblxcbjxocj5cXG5cXG48YSBkYXRhLWJpbmQ9XFxcInBhdGg6ICcvL2ZvbydcXFwiPmdvIHRvIGZvbzwvYT5cXG5cIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9sb2FkaW5nLWFuaW1hdGlvbi92aWV3cy9iYXIvdGVtcGxhdGUuaHRtbFxuLy8gbW9kdWxlIGlkID0gMjIzXG4vLyBtb2R1bGUgY2h1bmtzID0gNSAxMSAyMiIsIm1vZHVsZS5leHBvcnRzID0gXCJcXG48c3R5bGU+XFxuICAub3ZlcmxheS1sb2FkZXIge1xcbiAgICBwb3NpdGlvbjogZml4ZWQ7XFxuICAgIHRvcDogMDtcXG4gICAgbGVmdDogMDtcXG4gICAgaGVpZ2h0OiAxMDAlO1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgYmFja2dyb3VuZDogcmdiYSgyNTUsMjU1LDI1NSwuOCk7XFxuICAgIHotaW5kZXg6IDk5OTtcXG4gIH1cXG5cXG4gIC5vdmVybGF5LWxvYWRlci1pbm5lciB7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTtcXG4gICAgdG9wOiA1MCU7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgd2lkdGg6IDEwMCU7XFxuICAgIGNvbG9yOiAjRkZGO1xcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICB9XFxuXFxuICAub3ZlcmxheS1sb2FkZXItaW5uZXIgbGFiZWwge1xcbiAgICBmb250LXNpemU6IDIwcHg7XFxuICAgIG9wYWNpdHk6IDA7XFxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gICAgY29sb3I6ICM4MWI1ZWM7XFxuICB9XFxuXFxuICBAa2V5ZnJhbWVzIGxvbCB7XFxuICAgIDAlIHtcXG4gICAgICBvcGFjaXR5OiAwO1xcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMzAwcHgpO1xcbiAgICB9XFxuICAgIDUwJSB7XFxuICAgICAgb3BhY2l0eTogMTtcXG4gICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMHB4KTtcXG4gICAgfVxcbiAgICAxMDAlIHtcXG4gICAgICBvcGFjaXR5OiAwO1xcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgzMDBweCk7XFxuICAgIH1cXG4gIH1cXG5cXG4gIC5vdmVybGF5LWxvYWRlci1pbm5lciBsYWJlbDpudGgtY2hpbGQoNikge1xcbiAgICBhbmltYXRpb246IGxvbCAycyBpbmZpbml0ZSBlYXNlLWluLW91dDtcXG4gIH1cXG5cXG4gIC5vdmVybGF5LWxvYWRlci1pbm5lciBsYWJlbDpudGgtY2hpbGQoNSkge1xcbiAgICBhbmltYXRpb246IGxvbCAycyAxMDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDtcXG4gIH1cXG5cXG4gIC5vdmVybGF5LWxvYWRlci1pbm5lciBsYWJlbDpudGgtY2hpbGQoNCkge1xcbiAgICBhbmltYXRpb246IGxvbCAycyAyMDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDtcXG4gIH1cXG5cXG4gIC5vdmVybGF5LWxvYWRlci1pbm5lciBsYWJlbDpudGgtY2hpbGQoMykge1xcbiAgICBhbmltYXRpb246IGxvbCAycyAzMDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDtcXG4gIH1cXG5cXG4gIC5vdmVybGF5LWxvYWRlci1pbm5lciBsYWJlbDpudGgtY2hpbGQoMikge1xcbiAgICBhbmltYXRpb246IGxvbCAycyA0MDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDtcXG4gIH1cXG5cXG4gIC5vdmVybGF5LWxvYWRlci1pbm5lciBsYWJlbDpudGgtY2hpbGQoMSkge1xcbiAgICBhbmltYXRpb246IGxvbCAycyA1MDBtcyBpbmZpbml0ZSBlYXNlLWluLW91dDtcXG4gIH1cXG48L3N0eWxlPlxcblxcbjxkaXYgY2xhc3M9XFxcIm92ZXJsYXktbG9hZGVyXFxcIiBkYXRhLWJpbmQ9XFxcInZpc2libGU6IGlzTG9hZGluZ1xcXCI+XFxuICA8ZGl2IGNsYXNzPVxcXCJvdmVybGF5LWxvYWRlci1pbm5lclxcXCI+XFxuICAgIDxsYWJlbD4mIzk2Nzk7PC9sYWJlbD5cXG4gICAgPGxhYmVsPiYjOTY3OTs8L2xhYmVsPlxcbiAgICA8bGFiZWw+JiM5Njc5OzwvbGFiZWw+XFxuICAgIDxsYWJlbD4mIzk2Nzk7PC9sYWJlbD5cXG4gICAgPGxhYmVsPiYjOTY3OTs8L2xhYmVsPlxcbiAgICA8bGFiZWw+JiM5Njc5OzwvbGFiZWw+XFxuICA8L2Rpdj5cXG48L2Rpdj5cXG5cXG48cm91dGVyPjwvcm91dGVyPlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcGFja2FnZXMvcm91dGVyL2V4YW1wbGVzL2xvYWRpbmctYW5pbWF0aW9uL2luZGV4Lmh0bWxcbi8vIG1vZHVsZSBpZCA9IDIzMFxuLy8gbW9kdWxlIGNodW5rcyA9IDUgMjMiLCIvKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIHRoZVxuICogW2xhbmd1YWdlIHR5cGVdKGh0dHA6Ly93d3cuZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1lY21hc2NyaXB0LWxhbmd1YWdlLXR5cGVzKVxuICogb2YgYE9iamVjdGAuIChlLmcuIGFycmF5cywgZnVuY3Rpb25zLCBvYmplY3RzLCByZWdleGVzLCBgbmV3IE51bWJlcigwKWAsIGFuZCBgbmV3IFN0cmluZygnJylgKVxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFuIG9iamVjdCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0KHt9KTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KFsxLCAyLCAzXSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChfLm5vb3ApO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QobnVsbCk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc09iamVjdCh2YWx1ZSkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiB2YWx1ZTtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgKHR5cGUgPT0gJ29iamVjdCcgfHwgdHlwZSA9PSAnZnVuY3Rpb24nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc09iamVjdDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL2lzT2JqZWN0LmpzIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpLFxuICAgIGdldFJhd1RhZyA9IHJlcXVpcmUoJy4vX2dldFJhd1RhZycpLFxuICAgIG9iamVjdFRvU3RyaW5nID0gcmVxdWlyZSgnLi9fb2JqZWN0VG9TdHJpbmcnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIG51bGxUYWcgPSAnW29iamVjdCBOdWxsXScsXG4gICAgdW5kZWZpbmVkVGFnID0gJ1tvYmplY3QgVW5kZWZpbmVkXSc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBnZXRUYWdgIHdpdGhvdXQgZmFsbGJhY2tzIGZvciBidWdneSBlbnZpcm9ubWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gYmFzZUdldFRhZyh2YWx1ZSkge1xuICBpZiAodmFsdWUgPT0gbnVsbCkge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gdW5kZWZpbmVkID8gdW5kZWZpbmVkVGFnIDogbnVsbFRhZztcbiAgfVxuICByZXR1cm4gKHN5bVRvU3RyaW5nVGFnICYmIHN5bVRvU3RyaW5nVGFnIGluIE9iamVjdCh2YWx1ZSkpXG4gICAgPyBnZXRSYXdUYWcodmFsdWUpXG4gICAgOiBvYmplY3RUb1N0cmluZyh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZUdldFRhZztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlR2V0VGFnLmpzIiwidmFyIHJvb3QgPSByZXF1aXJlKCcuL19yb290Jyk7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIFN5bWJvbCA9IHJvb3QuU3ltYm9sO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN5bWJvbDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL19TeW1ib2wuanMiLCJ2YXIgYmFzZVJhbmRvbSA9IHJlcXVpcmUoJy4vX2Jhc2VSYW5kb20nKSxcbiAgICBpc0l0ZXJhdGVlQ2FsbCA9IHJlcXVpcmUoJy4vX2lzSXRlcmF0ZWVDYWxsJyksXG4gICAgdG9GaW5pdGUgPSByZXF1aXJlKCcuL3RvRmluaXRlJyk7XG5cbi8qKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyB3aXRob3V0IGEgZGVwZW5kZW5jeSBvbiBgcm9vdGAuICovXG52YXIgZnJlZVBhcnNlRmxvYXQgPSBwYXJzZUZsb2F0O1xuXG4vKiBCdWlsdC1pbiBtZXRob2QgcmVmZXJlbmNlcyBmb3IgdGhvc2Ugd2l0aCB0aGUgc2FtZSBuYW1lIGFzIG90aGVyIGBsb2Rhc2hgIG1ldGhvZHMuICovXG52YXIgbmF0aXZlTWluID0gTWF0aC5taW4sXG4gICAgbmF0aXZlUmFuZG9tID0gTWF0aC5yYW5kb207XG5cbi8qKlxuICogUHJvZHVjZXMgYSByYW5kb20gbnVtYmVyIGJldHdlZW4gdGhlIGluY2x1c2l2ZSBgbG93ZXJgIGFuZCBgdXBwZXJgIGJvdW5kcy5cbiAqIElmIG9ubHkgb25lIGFyZ3VtZW50IGlzIHByb3ZpZGVkIGEgbnVtYmVyIGJldHdlZW4gYDBgIGFuZCB0aGUgZ2l2ZW4gbnVtYmVyXG4gKiBpcyByZXR1cm5lZC4gSWYgYGZsb2F0aW5nYCBpcyBgdHJ1ZWAsIG9yIGVpdGhlciBgbG93ZXJgIG9yIGB1cHBlcmAgYXJlXG4gKiBmbG9hdHMsIGEgZmxvYXRpbmctcG9pbnQgbnVtYmVyIGlzIHJldHVybmVkIGluc3RlYWQgb2YgYW4gaW50ZWdlci5cbiAqXG4gKiAqKk5vdGU6KiogSmF2YVNjcmlwdCBmb2xsb3dzIHRoZSBJRUVFLTc1NCBzdGFuZGFyZCBmb3IgcmVzb2x2aW5nXG4gKiBmbG9hdGluZy1wb2ludCB2YWx1ZXMgd2hpY2ggY2FuIHByb2R1Y2UgdW5leHBlY3RlZCByZXN1bHRzLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC43LjBcbiAqIEBjYXRlZ29yeSBOdW1iZXJcbiAqIEBwYXJhbSB7bnVtYmVyfSBbbG93ZXI9MF0gVGhlIGxvd2VyIGJvdW5kLlxuICogQHBhcmFtIHtudW1iZXJ9IFt1cHBlcj0xXSBUaGUgdXBwZXIgYm91bmQuXG4gKiBAcGFyYW0ge2Jvb2xlYW59IFtmbG9hdGluZ10gU3BlY2lmeSByZXR1cm5pbmcgYSBmbG9hdGluZy1wb2ludCBudW1iZXIuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSByYW5kb20gbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnJhbmRvbSgwLCA1KTtcbiAqIC8vID0+IGFuIGludGVnZXIgYmV0d2VlbiAwIGFuZCA1XG4gKlxuICogXy5yYW5kb20oNSk7XG4gKiAvLyA9PiBhbHNvIGFuIGludGVnZXIgYmV0d2VlbiAwIGFuZCA1XG4gKlxuICogXy5yYW5kb20oNSwgdHJ1ZSk7XG4gKiAvLyA9PiBhIGZsb2F0aW5nLXBvaW50IG51bWJlciBiZXR3ZWVuIDAgYW5kIDVcbiAqXG4gKiBfLnJhbmRvbSgxLjIsIDUuMik7XG4gKiAvLyA9PiBhIGZsb2F0aW5nLXBvaW50IG51bWJlciBiZXR3ZWVuIDEuMiBhbmQgNS4yXG4gKi9cbmZ1bmN0aW9uIHJhbmRvbShsb3dlciwgdXBwZXIsIGZsb2F0aW5nKSB7XG4gIGlmIChmbG9hdGluZyAmJiB0eXBlb2YgZmxvYXRpbmcgIT0gJ2Jvb2xlYW4nICYmIGlzSXRlcmF0ZWVDYWxsKGxvd2VyLCB1cHBlciwgZmxvYXRpbmcpKSB7XG4gICAgdXBwZXIgPSBmbG9hdGluZyA9IHVuZGVmaW5lZDtcbiAgfVxuICBpZiAoZmxvYXRpbmcgPT09IHVuZGVmaW5lZCkge1xuICAgIGlmICh0eXBlb2YgdXBwZXIgPT0gJ2Jvb2xlYW4nKSB7XG4gICAgICBmbG9hdGluZyA9IHVwcGVyO1xuICAgICAgdXBwZXIgPSB1bmRlZmluZWQ7XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGVvZiBsb3dlciA9PSAnYm9vbGVhbicpIHtcbiAgICAgIGZsb2F0aW5nID0gbG93ZXI7XG4gICAgICBsb3dlciA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cbiAgaWYgKGxvd2VyID09PSB1bmRlZmluZWQgJiYgdXBwZXIgPT09IHVuZGVmaW5lZCkge1xuICAgIGxvd2VyID0gMDtcbiAgICB1cHBlciA9IDE7XG4gIH1cbiAgZWxzZSB7XG4gICAgbG93ZXIgPSB0b0Zpbml0ZShsb3dlcik7XG4gICAgaWYgKHVwcGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHVwcGVyID0gbG93ZXI7XG4gICAgICBsb3dlciA9IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHVwcGVyID0gdG9GaW5pdGUodXBwZXIpO1xuICAgIH1cbiAgfVxuICBpZiAobG93ZXIgPiB1cHBlcikge1xuICAgIHZhciB0ZW1wID0gbG93ZXI7XG4gICAgbG93ZXIgPSB1cHBlcjtcbiAgICB1cHBlciA9IHRlbXA7XG4gIH1cbiAgaWYgKGZsb2F0aW5nIHx8IGxvd2VyICUgMSB8fCB1cHBlciAlIDEpIHtcbiAgICB2YXIgcmFuZCA9IG5hdGl2ZVJhbmRvbSgpO1xuICAgIHJldHVybiBuYXRpdmVNaW4obG93ZXIgKyAocmFuZCAqICh1cHBlciAtIGxvd2VyICsgZnJlZVBhcnNlRmxvYXQoJzFlLScgKyAoKHJhbmQgKyAnJykubGVuZ3RoIC0gMSkpKSksIHVwcGVyKTtcbiAgfVxuICByZXR1cm4gYmFzZVJhbmRvbShsb3dlciwgdXBwZXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHJhbmRvbTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL3JhbmRvbS5qcyIsIi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVGbG9vciA9IE1hdGguZmxvb3IsXG4gICAgbmF0aXZlUmFuZG9tID0gTWF0aC5yYW5kb207XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucmFuZG9tYCB3aXRob3V0IHN1cHBvcnQgZm9yIHJldHVybmluZ1xuICogZmxvYXRpbmctcG9pbnQgbnVtYmVycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGxvd2VyIFRoZSBsb3dlciBib3VuZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSB1cHBlciBUaGUgdXBwZXIgYm91bmQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSByYW5kb20gbnVtYmVyLlxuICovXG5mdW5jdGlvbiBiYXNlUmFuZG9tKGxvd2VyLCB1cHBlcikge1xuICByZXR1cm4gbG93ZXIgKyBuYXRpdmVGbG9vcihuYXRpdmVSYW5kb20oKSAqICh1cHBlciAtIGxvd2VyICsgMSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VSYW5kb207XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wYWNrYWdlcy9yb3V0ZXIvZXhhbXBsZXMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZVJhbmRvbS5qcyIsInZhciBlcSA9IHJlcXVpcmUoJy4vZXEnKSxcbiAgICBpc0FycmF5TGlrZSA9IHJlcXVpcmUoJy4vaXNBcnJheUxpa2UnKSxcbiAgICBpc0luZGV4ID0gcmVxdWlyZSgnLi9faXNJbmRleCcpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKipcbiAqIENoZWNrcyBpZiB0aGUgZ2l2ZW4gYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHBvdGVudGlhbCBpdGVyYXRlZSB2YWx1ZSBhcmd1bWVudC5cbiAqIEBwYXJhbSB7Kn0gaW5kZXggVGhlIHBvdGVudGlhbCBpdGVyYXRlZSBpbmRleCBvciBrZXkgYXJndW1lbnQuXG4gKiBAcGFyYW0geyp9IG9iamVjdCBUaGUgcG90ZW50aWFsIGl0ZXJhdGVlIG9iamVjdCBhcmd1bWVudC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgYXJndW1lbnRzIGFyZSBmcm9tIGFuIGl0ZXJhdGVlIGNhbGwsXG4gKiAgZWxzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBpc0l0ZXJhdGVlQ2FsbCh2YWx1ZSwgaW5kZXgsIG9iamVjdCkge1xuICBpZiAoIWlzT2JqZWN0KG9iamVjdCkpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgdmFyIHR5cGUgPSB0eXBlb2YgaW5kZXg7XG4gIGlmICh0eXBlID09ICdudW1iZXInXG4gICAgICAgID8gKGlzQXJyYXlMaWtlKG9iamVjdCkgJiYgaXNJbmRleChpbmRleCwgb2JqZWN0Lmxlbmd0aCkpXG4gICAgICAgIDogKHR5cGUgPT0gJ3N0cmluZycgJiYgaW5kZXggaW4gb2JqZWN0KVxuICAgICAgKSB7XG4gICAgcmV0dXJuIGVxKG9iamVjdFtpbmRleF0sIHZhbHVlKTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNJdGVyYXRlZUNhbGw7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wYWNrYWdlcy9yb3V0ZXIvZXhhbXBsZXMvbm9kZV9tb2R1bGVzL2xvZGFzaC9faXNJdGVyYXRlZUNhbGwuanMiLCIvKipcbiAqIFBlcmZvcm1zIGFcbiAqIFtgU2FtZVZhbHVlWmVyb2BdKGh0dHA6Ly9lY21hLWludGVybmF0aW9uYWwub3JnL2VjbWEtMjYyLzcuMC8jc2VjLXNhbWV2YWx1ZXplcm8pXG4gKiBjb21wYXJpc29uIGJldHdlZW4gdHdvIHZhbHVlcyB0byBkZXRlcm1pbmUgaWYgdGhleSBhcmUgZXF1aXZhbGVudC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29tcGFyZS5cbiAqIEBwYXJhbSB7Kn0gb3RoZXIgVGhlIG90aGVyIHZhbHVlIHRvIGNvbXBhcmUuXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIHZhbHVlcyBhcmUgZXF1aXZhbGVudCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiB2YXIgb2JqZWN0ID0geyAnYSc6IDEgfTtcbiAqIHZhciBvdGhlciA9IHsgJ2EnOiAxIH07XG4gKlxuICogXy5lcShvYmplY3QsIG9iamVjdCk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcShvYmplY3QsIG90aGVyKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcSgnYScsICdhJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5lcSgnYScsIE9iamVjdCgnYScpKTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5lcShOYU4sIE5hTik7XG4gKiAvLyA9PiB0cnVlXG4gKi9cbmZ1bmN0aW9uIGVxKHZhbHVlLCBvdGhlcikge1xuICByZXR1cm4gdmFsdWUgPT09IG90aGVyIHx8ICh2YWx1ZSAhPT0gdmFsdWUgJiYgb3RoZXIgIT09IG90aGVyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBlcTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL2VxLmpzIiwidmFyIGlzRnVuY3Rpb24gPSByZXF1aXJlKCcuL2lzRnVuY3Rpb24nKSxcbiAgICBpc0xlbmd0aCA9IHJlcXVpcmUoJy4vaXNMZW5ndGgnKTtcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBhcnJheS1saWtlLiBBIHZhbHVlIGlzIGNvbnNpZGVyZWQgYXJyYXktbGlrZSBpZiBpdCdzXG4gKiBub3QgYSBmdW5jdGlvbiBhbmQgaGFzIGEgYHZhbHVlLmxlbmd0aGAgdGhhdCdzIGFuIGludGVnZXIgZ3JlYXRlciB0aGFuIG9yXG4gKiBlcXVhbCB0byBgMGAgYW5kIGxlc3MgdGhhbiBvciBlcXVhbCB0byBgTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVJgLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGFycmF5LWxpa2UsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0FycmF5TGlrZShbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNBcnJheUxpa2UoZG9jdW1lbnQuYm9keS5jaGlsZHJlbik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZSgnYWJjJyk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc0FycmF5TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNBcnJheUxpa2UodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9IG51bGwgJiYgaXNMZW5ndGgodmFsdWUubGVuZ3RoKSAmJiAhaXNGdW5jdGlvbih2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNBcnJheUxpa2U7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wYWNrYWdlcy9yb3V0ZXIvZXhhbXBsZXMvbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0FycmF5TGlrZS5qcyIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgYXN5bmNUYWcgPSAnW29iamVjdCBBc3luY0Z1bmN0aW9uXScsXG4gICAgZnVuY1RhZyA9ICdbb2JqZWN0IEZ1bmN0aW9uXScsXG4gICAgZ2VuVGFnID0gJ1tvYmplY3QgR2VuZXJhdG9yRnVuY3Rpb25dJyxcbiAgICBwcm94eVRhZyA9ICdbb2JqZWN0IFByb3h5XSc7XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgY2xhc3NpZmllZCBhcyBhIGBGdW5jdGlvbmAgb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgZnVuY3Rpb24sIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0Z1bmN0aW9uKF8pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNGdW5jdGlvbigvYWJjLyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKHZhbHVlKSB7XG4gIGlmICghaXNPYmplY3QodmFsdWUpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIC8vIFRoZSB1c2Ugb2YgYE9iamVjdCN0b1N0cmluZ2AgYXZvaWRzIGlzc3VlcyB3aXRoIHRoZSBgdHlwZW9mYCBvcGVyYXRvclxuICAvLyBpbiBTYWZhcmkgOSB3aGljaCByZXR1cm5zICdvYmplY3QnIGZvciB0eXBlZCBhcnJheXMgYW5kIG90aGVyIGNvbnN0cnVjdG9ycy5cbiAgdmFyIHRhZyA9IGJhc2VHZXRUYWcodmFsdWUpO1xuICByZXR1cm4gdGFnID09IGZ1bmNUYWcgfHwgdGFnID09IGdlblRhZyB8fCB0YWcgPT0gYXN5bmNUYWcgfHwgdGFnID09IHByb3h5VGFnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzRnVuY3Rpb247XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wYWNrYWdlcy9yb3V0ZXIvZXhhbXBsZXMvbm9kZV9tb2R1bGVzL2xvZGFzaC9pc0Z1bmN0aW9uLmpzIiwidmFyIGZyZWVHbG9iYWwgPSByZXF1aXJlKCcuL19mcmVlR2xvYmFsJyk7XG5cbi8qKiBEZXRlY3QgZnJlZSB2YXJpYWJsZSBgc2VsZmAuICovXG52YXIgZnJlZVNlbGYgPSB0eXBlb2Ygc2VsZiA9PSAnb2JqZWN0JyAmJiBzZWxmICYmIHNlbGYuT2JqZWN0ID09PSBPYmplY3QgJiYgc2VsZjtcblxuLyoqIFVzZWQgYXMgYSByZWZlcmVuY2UgdG8gdGhlIGdsb2JhbCBvYmplY3QuICovXG52YXIgcm9vdCA9IGZyZWVHbG9iYWwgfHwgZnJlZVNlbGYgfHwgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblxubW9kdWxlLmV4cG9ydHMgPSByb290O1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcGFja2FnZXMvcm91dGVyL2V4YW1wbGVzL25vZGVfbW9kdWxlcy9sb2Rhc2gvX3Jvb3QuanMiLCIvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZyZWVHbG9iYWw7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wYWNrYWdlcy9yb3V0ZXIvZXhhbXBsZXMvbm9kZV9tb2R1bGVzL2xvZGFzaC9fZnJlZUdsb2JhbC5qcyIsInZhciBTeW1ib2wgPSByZXF1aXJlKCcuL19TeW1ib2wnKTtcblxuLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqIFVzZWQgdG8gY2hlY2sgb2JqZWN0cyBmb3Igb3duIHByb3BlcnRpZXMuICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBvYmplY3RQcm90by5oYXNPd25Qcm9wZXJ0eTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKiBCdWlsdC1pbiB2YWx1ZSByZWZlcmVuY2VzLiAqL1xudmFyIHN5bVRvU3RyaW5nVGFnID0gU3ltYm9sID8gU3ltYm9sLnRvU3RyaW5nVGFnIDogdW5kZWZpbmVkO1xuXG4vKipcbiAqIEEgc3BlY2lhbGl6ZWQgdmVyc2lvbiBvZiBgYmFzZUdldFRhZ2Agd2hpY2ggaWdub3JlcyBgU3ltYm9sLnRvU3RyaW5nVGFnYCB2YWx1ZXMuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHF1ZXJ5LlxuICogQHJldHVybnMge3N0cmluZ30gUmV0dXJucyB0aGUgcmF3IGB0b1N0cmluZ1RhZ2AuXG4gKi9cbmZ1bmN0aW9uIGdldFJhd1RhZyh2YWx1ZSkge1xuICB2YXIgaXNPd24gPSBoYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBzeW1Ub1N0cmluZ1RhZyksXG4gICAgICB0YWcgPSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG5cbiAgdHJ5IHtcbiAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB1bmRlZmluZWQ7XG4gICAgdmFyIHVubWFza2VkID0gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge31cblxuICB2YXIgcmVzdWx0ID0gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG4gIGlmICh1bm1hc2tlZCkge1xuICAgIGlmIChpc093bikge1xuICAgICAgdmFsdWVbc3ltVG9TdHJpbmdUYWddID0gdGFnO1xuICAgIH0gZWxzZSB7XG4gICAgICBkZWxldGUgdmFsdWVbc3ltVG9TdHJpbmdUYWddO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGdldFJhd1RhZztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL19nZXRSYXdUYWcuanMiLCIvKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgc3RyaW5nIHVzaW5nIGBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nYC5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY29udmVydC5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIGNvbnZlcnRlZCBzdHJpbmcuXG4gKi9cbmZ1bmN0aW9uIG9iamVjdFRvU3RyaW5nKHZhbHVlKSB7XG4gIHJldHVybiBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBvYmplY3RUb1N0cmluZztcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL19vYmplY3RUb1N0cmluZy5qcyIsIi8qKiBVc2VkIGFzIHJlZmVyZW5jZXMgZm9yIHZhcmlvdXMgYE51bWJlcmAgY29uc3RhbnRzLiAqL1xudmFyIE1BWF9TQUZFX0lOVEVHRVIgPSA5MDA3MTk5MjU0NzQwOTkxO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgYXJyYXktbGlrZSBsZW5ndGguXG4gKlxuICogKipOb3RlOioqIFRoaXMgbWV0aG9kIGlzIGxvb3NlbHkgYmFzZWQgb25cbiAqIFtgVG9MZW5ndGhgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy10b2xlbmd0aCkuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNoZWNrLlxuICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBsZW5ndGgsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc0xlbmd0aCgzKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzTGVuZ3RoKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzTGVuZ3RoKEluZmluaXR5KTtcbiAqIC8vID0+IGZhbHNlXG4gKlxuICogXy5pc0xlbmd0aCgnMycpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNMZW5ndGgodmFsdWUpIHtcbiAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyAmJlxuICAgIHZhbHVlID4gLTEgJiYgdmFsdWUgJSAxID09IDAgJiYgdmFsdWUgPD0gTUFYX1NBRkVfSU5URUdFUjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc0xlbmd0aDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL2lzTGVuZ3RoLmpzIiwiLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTUFYX1NBRkVfSU5URUdFUiA9IDkwMDcxOTkyNTQ3NDA5OTE7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCB1bnNpZ25lZCBpbnRlZ2VyIHZhbHVlcy4gKi9cbnZhciByZUlzVWludCA9IC9eKD86MHxbMS05XVxcZCopJC87XG5cbi8qKlxuICogQ2hlY2tzIGlmIGB2YWx1ZWAgaXMgYSB2YWxpZCBhcnJheS1saWtlIGluZGV4LlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbbGVuZ3RoPU1BWF9TQUZFX0lOVEVHRVJdIFRoZSB1cHBlciBib3VuZHMgb2YgYSB2YWxpZCBpbmRleC5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgdmFsaWQgaW5kZXgsIGVsc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gaXNJbmRleCh2YWx1ZSwgbGVuZ3RoKSB7XG4gIGxlbmd0aCA9IGxlbmd0aCA9PSBudWxsID8gTUFYX1NBRkVfSU5URUdFUiA6IGxlbmd0aDtcbiAgcmV0dXJuICEhbGVuZ3RoICYmXG4gICAgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJyB8fCByZUlzVWludC50ZXN0KHZhbHVlKSkgJiZcbiAgICAodmFsdWUgPiAtMSAmJiB2YWx1ZSAlIDEgPT0gMCAmJiB2YWx1ZSA8IGxlbmd0aCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNJbmRleDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL19pc0luZGV4LmpzIiwidmFyIHRvTnVtYmVyID0gcmVxdWlyZSgnLi90b051bWJlcicpO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBJTkZJTklUWSA9IDEgLyAwLFxuICAgIE1BWF9JTlRFR0VSID0gMS43OTc2OTMxMzQ4NjIzMTU3ZSszMDg7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIGZpbml0ZSBudW1iZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjEyLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjb252ZXJ0LlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgY29udmVydGVkIG51bWJlci5cbiAqIEBleGFtcGxlXG4gKlxuICogXy50b0Zpbml0ZSgzLjIpO1xuICogLy8gPT4gMy4yXG4gKlxuICogXy50b0Zpbml0ZShOdW1iZXIuTUlOX1ZBTFVFKTtcbiAqIC8vID0+IDVlLTMyNFxuICpcbiAqIF8udG9GaW5pdGUoSW5maW5pdHkpO1xuICogLy8gPT4gMS43OTc2OTMxMzQ4NjIzMTU3ZSszMDhcbiAqXG4gKiBfLnRvRmluaXRlKCczLjInKTtcbiAqIC8vID0+IDMuMlxuICovXG5mdW5jdGlvbiB0b0Zpbml0ZSh2YWx1ZSkge1xuICBpZiAoIXZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSAwID8gdmFsdWUgOiAwO1xuICB9XG4gIHZhbHVlID0gdG9OdW1iZXIodmFsdWUpO1xuICBpZiAodmFsdWUgPT09IElORklOSVRZIHx8IHZhbHVlID09PSAtSU5GSU5JVFkpIHtcbiAgICB2YXIgc2lnbiA9ICh2YWx1ZSA8IDAgPyAtMSA6IDEpO1xuICAgIHJldHVybiBzaWduICogTUFYX0lOVEVHRVI7XG4gIH1cbiAgcmV0dXJuIHZhbHVlID09PSB2YWx1ZSA/IHZhbHVlIDogMDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB0b0Zpbml0ZTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL3RvRmluaXRlLmpzIiwidmFyIGlzT2JqZWN0ID0gcmVxdWlyZSgnLi9pc09iamVjdCcpLFxuICAgIGlzU3ltYm9sID0gcmVxdWlyZSgnLi9pc1N5bWJvbCcpO1xuXG4vKiogVXNlZCBhcyByZWZlcmVuY2VzIGZvciB2YXJpb3VzIGBOdW1iZXJgIGNvbnN0YW50cy4gKi9cbnZhciBOQU4gPSAwIC8gMDtcblxuLyoqIFVzZWQgdG8gbWF0Y2ggbGVhZGluZyBhbmQgdHJhaWxpbmcgd2hpdGVzcGFjZS4gKi9cbnZhciByZVRyaW0gPSAvXlxccyt8XFxzKyQvZztcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IGJhZCBzaWduZWQgaGV4YWRlY2ltYWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmFkSGV4ID0gL15bLStdMHhbMC05YS1mXSskL2k7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiaW5hcnkgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzQmluYXJ5ID0gL14wYlswMV0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3Qgb2N0YWwgc3RyaW5nIHZhbHVlcy4gKi9cbnZhciByZUlzT2N0YWwgPSAvXjBvWzAtN10rJC9pO1xuXG4vKiogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgd2l0aG91dCBhIGRlcGVuZGVuY3kgb24gYHJvb3RgLiAqL1xudmFyIGZyZWVQYXJzZUludCA9IHBhcnNlSW50O1xuXG4vKipcbiAqIENvbnZlcnRzIGB2YWx1ZWAgdG8gYSBudW1iZXIuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSA0LjAuMFxuICogQGNhdGVnb3J5IExhbmdcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIHByb2Nlc3MuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8udG9OdW1iZXIoMy4yKTtcbiAqIC8vID0+IDMuMlxuICpcbiAqIF8udG9OdW1iZXIoTnVtYmVyLk1JTl9WQUxVRSk7XG4gKiAvLyA9PiA1ZS0zMjRcbiAqXG4gKiBfLnRvTnVtYmVyKEluZmluaXR5KTtcbiAqIC8vID0+IEluZmluaXR5XG4gKlxuICogXy50b051bWJlcignMy4yJyk7XG4gKiAvLyA9PiAzLjJcbiAqL1xuZnVuY3Rpb24gdG9OdW1iZXIodmFsdWUpIHtcbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuICBpZiAoaXNTeW1ib2wodmFsdWUpKSB7XG4gICAgcmV0dXJuIE5BTjtcbiAgfVxuICBpZiAoaXNPYmplY3QodmFsdWUpKSB7XG4gICAgdmFyIG90aGVyID0gdHlwZW9mIHZhbHVlLnZhbHVlT2YgPT0gJ2Z1bmN0aW9uJyA/IHZhbHVlLnZhbHVlT2YoKSA6IHZhbHVlO1xuICAgIHZhbHVlID0gaXNPYmplY3Qob3RoZXIpID8gKG90aGVyICsgJycpIDogb3RoZXI7XG4gIH1cbiAgaWYgKHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykge1xuICAgIHJldHVybiB2YWx1ZSA9PT0gMCA/IHZhbHVlIDogK3ZhbHVlO1xuICB9XG4gIHZhbHVlID0gdmFsdWUucmVwbGFjZShyZVRyaW0sICcnKTtcbiAgdmFyIGlzQmluYXJ5ID0gcmVJc0JpbmFyeS50ZXN0KHZhbHVlKTtcbiAgcmV0dXJuIChpc0JpbmFyeSB8fCByZUlzT2N0YWwudGVzdCh2YWx1ZSkpXG4gICAgPyBmcmVlUGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIGlzQmluYXJ5ID8gMiA6IDgpXG4gICAgOiAocmVJc0JhZEhleC50ZXN0KHZhbHVlKSA/IE5BTiA6ICt2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9OdW1iZXI7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wYWNrYWdlcy9yb3V0ZXIvZXhhbXBsZXMvbm9kZV9tb2R1bGVzL2xvZGFzaC90b051bWJlci5qcyIsInZhciBiYXNlR2V0VGFnID0gcmVxdWlyZSgnLi9fYmFzZUdldFRhZycpLFxuICAgIGlzT2JqZWN0TGlrZSA9IHJlcXVpcmUoJy4vaXNPYmplY3RMaWtlJyk7XG5cbi8qKiBgT2JqZWN0I3RvU3RyaW5nYCByZXN1bHQgcmVmZXJlbmNlcy4gKi9cbnZhciBzeW1ib2xUYWcgPSAnW29iamVjdCBTeW1ib2xdJztcblxuLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBjbGFzc2lmaWVkIGFzIGEgYFN5bWJvbGAgcHJpbWl0aXZlIG9yIG9iamVjdC5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhIHN5bWJvbCwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzU3ltYm9sKFN5bWJvbC5pdGVyYXRvcik7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc1N5bWJvbCgnYWJjJyk7XG4gKiAvLyA9PiBmYWxzZVxuICovXG5mdW5jdGlvbiBpc1N5bWJvbCh2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09ICdzeW1ib2wnIHx8XG4gICAgKGlzT2JqZWN0TGlrZSh2YWx1ZSkgJiYgYmFzZUdldFRhZyh2YWx1ZSkgPT0gc3ltYm9sVGFnKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpc1N5bWJvbDtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9ub2RlX21vZHVsZXMvbG9kYXNoL2lzU3ltYm9sLmpzIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3RMaWtlO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vcGFja2FnZXMvcm91dGVyL2V4YW1wbGVzL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3RMaWtlLmpzIiwiLyogXG4qKiBUb1Byb2dyZXNzIHYwLjEuMVxuKiogaHR0cDovL2dpdGh1Yi5jb20vZGp5ZGUvVG9Qcm9ncmVzc1xuKi9cblxuLy8gQW5pbWF0aW9uIERldGVjdGlvblxuZnVuY3Rpb24gd2hpY2hUcmFuc2l0aW9uRXZlbnQoKXtcbiAgdmFyIHQsXG4gICAgICBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJmYWtlZWxlbWVudFwiKTtcblxuICB2YXIgdHJhbnNpdGlvbnMgPSB7XG4gICAgXCJ0cmFuc2l0aW9uXCIgICAgICA6IFwidHJhbnNpdGlvbmVuZFwiLFxuICAgIFwiT1RyYW5zaXRpb25cIiAgICAgOiBcIm9UcmFuc2l0aW9uRW5kXCIsXG4gICAgXCJNb3pUcmFuc2l0aW9uXCIgICA6IFwidHJhbnNpdGlvbmVuZFwiLFxuICAgIFwiV2Via2l0VHJhbnNpdGlvblwiOiBcIndlYmtpdFRyYW5zaXRpb25FbmRcIlxuICB9XG5cbiAgZm9yICh0IGluIHRyYW5zaXRpb25zKXtcbiAgICBpZiAoZWwuc3R5bGVbdF0gIT09IHVuZGVmaW5lZCl7XG4gICAgICByZXR1cm4gdHJhbnNpdGlvbnNbdF07XG4gICAgfVxuICB9XG59XG5cbnZhciB0cmFuc2l0aW9uRXZlbnQgPSB3aGljaFRyYW5zaXRpb25FdmVudCgpO1xuXG52YXIgVG9Qcm9ncmVzcyA9IGZ1bmN0aW9uKG9wdCwgc2VsZWN0b3IpIHtcbiAgLy8gQXR0cmlidXRlc1xuICB2YXIgdGhhdCA9IHRoaXM7XG4gIHRoaXMucHJvZ3Jlc3MgPSAwO1xuICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgaWQ6ICd0b3AtcHJvZ3Jlc3MtYmFyJyxcbiAgICBjb2xvcjogJyNGNDQzMzYnLFxuICAgIGhlaWdodDogJzJweCcsXG4gICAgZHVyYXRpb246IDAuMixcbiAgICBwb3NpdGlvbjogJ3RvcCdcbiAgfTtcbiAgaWYgKG9wdCAmJiB0eXBlb2Ygb3B0ID09PSAnb2JqZWN0Jykge1xuICAgIGZvciAodmFyIGtleSBpbiBvcHQpIHtcbiAgICAgIHRoaXMub3B0aW9uc1trZXldID0gb3B0W2tleV07XG4gICAgfVxuICB9XG4gIHRoaXMub3B0aW9ucy5vcGFjaXR5RHVyYXRpb24gPSB0aGlzLm9wdGlvbnMuZHVyYXRpb24gKiAzO1xuICB0aGlzLnByb2dyZXNzQmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cbiAgLy8gSW5pdGlhbGl6YXRpb25cbiAgdGhpcy5wcm9ncmVzc0Jhci5pZCA9IHRoaXMub3B0aW9ucy5pZDtcbiAgdGhpcy5wcm9ncmVzc0Jhci5zZXRDU1MgPSBmdW5jdGlvbihzdHlsZSkge1xuICAgIGZvcih2YXIgcHJvcGVydHkgaW4gc3R5bGUpe1xuICAgICAgdGhpcy5zdHlsZVtwcm9wZXJ0eV0gPSBzdHlsZVtwcm9wZXJ0eV07XG4gICAgfVxuICB9XG4gIHRoaXMucHJvZ3Jlc3NCYXIuc2V0Q1NTKHtcbiAgICBcInBvc2l0aW9uXCI6IHNlbGVjdG9yID8gXCJyZWxhdGl2ZVwiIDogXCJmaXhlZFwiLFxuICAgIFwidG9wXCI6IHRoaXMub3B0aW9ucy5wb3NpdGlvbiA9PT0gJ3RvcCcgPyBcIjBcIiA6ICdhdXRvJyAsXG4gICAgXCJib3R0b21cIjogdGhpcy5vcHRpb25zLnBvc2l0aW9uID09PSAnYm90dG9tJyA/IFwiMFwiIDogJ2F1dG8nICxcbiAgICBcImxlZnRcIjogXCIwXCIsXG4gICAgXCJyaWdodFwiOiBcIjBcIixcbiAgICBcImJhY2tncm91bmQtY29sb3JcIjogdGhpcy5vcHRpb25zLmNvbG9yLFxuICAgIFwiaGVpZ2h0XCI6IHRoaXMub3B0aW9ucy5oZWlnaHQsXG4gICAgXCJ3aWR0aFwiOiBcIjAlXCIsXG4gICAgXCJ0cmFuc2l0aW9uXCI6IFwid2lkdGggXCIgKyB0aGlzLm9wdGlvbnMuZHVyYXRpb24gKyBcInNcIiArIFwiLCBvcGFjaXR5IFwiICsgdGhpcy5vcHRpb25zLm9wYWNpdHlEdXJhdGlvbiArIFwic1wiLFxuICAgIFwiLW1vei10cmFuc2l0aW9uXCI6IFwid2lkdGggXCIgKyB0aGlzLm9wdGlvbnMuZHVyYXRpb24gKyBcInNcIiArIFwiLCBvcGFjaXR5IFwiICsgdGhpcy5vcHRpb25zLm9wYWNpdHlEdXJhdGlvbiArIFwic1wiLFxuICAgIFwiLXdlYmtpdC10cmFuc2l0aW9uXCI6IFwid2lkdGggXCIgKyB0aGlzLm9wdGlvbnMuZHVyYXRpb24gKyBcInNcIiArIFwiLCBvcGFjaXR5IFwiICsgdGhpcy5vcHRpb25zLm9wYWNpdHlEdXJhdGlvbiArIFwic1wiXG4gIH0pO1xuXG4gIC8vIENyZWF0ZSB0aGUgUHJvZ3Jlc3MgQmFyXG4gIGlmIChzZWxlY3Rvcikge1xuICAgIHZhciBlbCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpO1xuICAgIGlmIChlbCkge1xuICAgICAgaWYgKGVsLmhhc0NoaWxkTm9kZXMoKSkge1xuICAgICAgICBlbC5pbnNlcnRCZWZvcmUodGhpcy5wcm9ncmVzc0JhciwgZWwuZmlyc3RDaGlsZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbC5hcHBlbmRDaGlsZCh0aGlzLnByb2dyZXNzQmFyKTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLnByb2dyZXNzQmFyKTtcbiAgfVxufVxuXG5Ub1Byb2dyZXNzLnByb3RvdHlwZS50cmFuc2l0ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucHJvZ3Jlc3NCYXIuc3R5bGUud2lkdGggPSB0aGlzLnByb2dyZXNzICsgJyUnO1xufVxuXG5Ub1Byb2dyZXNzLnByb3RvdHlwZS5nZXRQcm9ncmVzcyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gdGhpcy5wcm9ncmVzcztcbn1cblxuVG9Qcm9ncmVzcy5wcm90b3R5cGUuc2V0UHJvZ3Jlc3MgPSBmdW5jdGlvbihwcm9ncmVzcywgY2FsbGJhY2spIHtcbiAgdGhpcy5zaG93KCk7XG4gIGlmIChwcm9ncmVzcyA+IDEwMCkge1xuICAgIHRoaXMucHJvZ3Jlc3MgPSAxMDA7XG4gIH0gZWxzZSBpZiAocHJvZ3Jlc3MgPCAwKSB7XG4gICAgdGhpcy5wcm9ncmVzcyA9IDA7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5wcm9ncmVzcyA9IHByb2dyZXNzO1xuICB9XG4gIHRoaXMudHJhbnNpdCgpO1xuICBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xufVxuXG5Ub1Byb2dyZXNzLnByb3RvdHlwZS5pbmNyZWFzZSA9IGZ1bmN0aW9uKHRvQmVJbmNyZWFzZWRQcm9ncmVzcywgY2FsbGJhY2spIHtcbiAgdGhpcy5zaG93KCk7XG4gIHRoaXMuc2V0UHJvZ3Jlc3ModGhpcy5wcm9ncmVzcyArIHRvQmVJbmNyZWFzZWRQcm9ncmVzcywgY2FsbGJhY2spO1xufVxuXG5Ub1Byb2dyZXNzLnByb3RvdHlwZS5kZWNyZWFzZSA9IGZ1bmN0aW9uKHRvQmVEZWNyZWFzZWRQcm9ncmVzcywgY2FsbGJhY2spIHtcbiAgdGhpcy5zaG93KCk7XG4gIHRoaXMuc2V0UHJvZ3Jlc3ModGhpcy5wcm9ncmVzcyAtIHRvQmVEZWNyZWFzZWRQcm9ncmVzcywgY2FsbGJhY2spO1xufVxuXG5Ub1Byb2dyZXNzLnByb3RvdHlwZS5maW5pc2ggPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICB2YXIgdGhhdCA9IHRoaXM7XG4gIHRoaXMuc2V0UHJvZ3Jlc3MoMTAwLCBjYWxsYmFjayk7XG4gIHRoaXMuaGlkZSgpO1xuICB0cmFuc2l0aW9uRXZlbnQgJiYgdGhpcy5wcm9ncmVzc0Jhci5hZGRFdmVudExpc3RlbmVyKHRyYW5zaXRpb25FdmVudCwgZnVuY3Rpb24oZSkge1xuICAgIHRoYXQucmVzZXQoKTtcbiAgICB0aGF0LnByb2dyZXNzQmFyLnJlbW92ZUV2ZW50TGlzdGVuZXIoZS50eXBlLCBhcmd1bWVudHMuY2FsbGVlKTtcbiAgfSk7XG59XG5cblRvUHJvZ3Jlc3MucHJvdG90eXBlLnJlc2V0ID0gZnVuY3Rpb24oY2FsbGJhY2spIHtcbiAgdGhpcy5wcm9ncmVzcyA9IDA7XG4gIHRoaXMudHJhbnNpdCgpO1xuICBjYWxsYmFjayAmJiBjYWxsYmFjaygpO1xufVxuXG5Ub1Byb2dyZXNzLnByb3RvdHlwZS5oaWRlID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucHJvZ3Jlc3NCYXIuc3R5bGUub3BhY2l0eSA9ICcwJztcbn1cblxuVG9Qcm9ncmVzcy5wcm90b3R5cGUuc2hvdyA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLnByb2dyZXNzQmFyLnN0eWxlLm9wYWNpdHkgPSAnMSc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVG9Qcm9ncmVzcztcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9wYWNrYWdlcy9yb3V0ZXIvZXhhbXBsZXMvbm9kZV9tb2R1bGVzL3RvcHJvZ3Jlc3MvbGliL3RvcHJvZ3Jlc3MuanMiLCJpbXBvcnQgKiBhcyBrbyBmcm9tICdrbm9ja291dCdcbmltcG9ydCB0ZW1wbGF0ZSBmcm9tICcuL3RlbXBsYXRlLmh0bWwnXG5cbmtvLmNvbXBvbmVudHMucmVnaXN0ZXIoJ2ZvbycsIHsgdGVtcGxhdGUgfSlcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9sb2FkaW5nLWFuaW1hdGlvbi92aWV3cy9mb28vaW5kZXgudHMiLCJpbXBvcnQgKiBhcyBrbyBmcm9tICdrbm9ja291dCdcbmltcG9ydCB0ZW1wbGF0ZSBmcm9tICcuL3RlbXBsYXRlLmh0bWwnXG5cbmtvLmNvbXBvbmVudHMucmVnaXN0ZXIoJ2JhcicsIHsgdGVtcGxhdGUgfSlcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9sb2FkaW5nLWFuaW1hdGlvbi92aWV3cy9iYXIvaW5kZXgudHMiLCJpbXBvcnQgcmFuZG9tIGZyb20gJ2xvZGFzaC9yYW5kb20nXG5pbXBvcnQgKiBhcyBrbyBmcm9tICdrbm9ja291dCdcbmltcG9ydCAqIGFzIFRvUHJvZ3Jlc3MgZnJvbSAndG9wcm9ncmVzcydcbmltcG9ydCB7IENvbnRleHQsIElDb250ZXh0LCBNaWRkbGV3YXJlLCBSb3V0ZXIgfSBmcm9tICdAcHJvZmlzY2llbmNlL2tub2Nrb3V0LWNvbnRyaWItcm91dGVyJ1xuaW1wb3J0ICcuL3ZpZXdzL2ZvbydcbmltcG9ydCAnLi92aWV3cy9iYXInXG5pbXBvcnQgdGVtcGxhdGUgZnJvbSAnLi9pbmRleC5odG1sJ1xuXG5mdW5jdGlvbiBjcmVhdGVMb2FkaW5nTWlkZGxld2FyZShpc0xvYWRpbmc6IEtub2Nrb3V0T2JzZXJ2YWJsZTxib29sZWFuPik6IE1pZGRsZXdhcmUge1xuICBsZXQgbG9hZGluZ0JhcjogVG9Qcm9ncmVzc1xuICBsZXQgbG9hZGluZ0JhckludGVydmFsOiBOb2RlSlMuVGltZXJcblxuICByZXR1cm4gZnVuY3Rpb24qKGN0eDogQ29udGV4dCAmIElDb250ZXh0KSB7XG4gICAgICAvLyBydW4gb25jZSBmb3IgdG9wLW1vc3Qgcm91dGVyXG4gICAgICBpZiAoIWxvYWRpbmdCYXIpIHtcbiAgICAgICAgLy8gdG9nZ2xlIG92ZXJsYXkgKG9ic2VydmFibGUgcGFzc2VkIGluKVxuICAgICAgICBMT0FESU5HKHRydWUpXG5cbiAgICAgICAgLy8gc3RhcnQgbG9hZGluZyBiYXJcbiAgICAgICAgbG9hZGluZ0JhciA9IG5ldyBUb1Byb2dyZXNzKHtcbiAgICAgICAgICBjb2xvcjogJyMwMDAnLFxuICAgICAgICAgIGR1cmF0aW9uOiAwLjIsXG4gICAgICAgICAgaGVpZ2h0OiAnNXB4J1xuICAgICAgICB9KVxuICAgICAgICBsb2FkaW5nQmFySW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgbG9hZGluZ0Jhci5pbmNyZWFzZSgxKVxuICAgICAgICB9LCAxMDApXG4gICAgICB9XG5cbiAgICAgIHlpZWxkXG5cbiAgICAgIC8vIGVuZCBsb2FkaW5nIGluIGJvdHRvbS1tb3N0IHJvdXRlciBhZnRlclJlbmRlclxuICAgICAgaWYgKCFjdHguJGNoaWxkKSB7XG4gICAgICAgIGxvYWRpbmdCYXIuZmluaXNoKClcbiAgICAgICAgY2xlYXJJbnRlcnZhbChsb2FkaW5nQmFySW50ZXJ2YWwpXG4gICAgICAgIExPQURJTkcoZmFsc2UpXG4gICAgICAgIC8vIHJlc2V0IGZvciBuZXh0IG5hdmlnYXRpb25cbiAgICAgICAgbG9hZGluZ0JhciA9IG51bGxcbiAgICAgICAgbG9hZGluZ0JhckludGVydmFsID0gbnVsbFxuICAgICAgfVxuICB9XG59XG5cbmNvbnN0IExPQURJTkcgPSBrby5vYnNlcnZhYmxlKHRydWUpXG5cbi8vIHBhc3MgbG9hZGluZyBvYnNlcnZhYmxlIGludG8gbWlkZGxld2FyZSBmYWN0b3J5XG5Sb3V0ZXIudXNlKGNyZWF0ZUxvYWRpbmdNaWRkbGV3YXJlKExPQURJTkcpKVxuXG5Sb3V0ZXIudXNlUm91dGVzKHtcbiAgJy8nOiAoY3R4KSA9PiBjdHgucmVkaXJlY3QoJy9mb28nKSxcblxuICAvLyBzaW11bGF0ZSBhIGRlZXBseSBuZXN0ZWQgcm91dGUgdy8gdGltZW91dHMgKHdvdWxkIGJlIGFqYXggb3Igd2hhdCBoYXZlIHlvdVxuICAvLyBpbiByZWFsIGxpZmUpXG4gICcvZm9vJzogW1xuICAgIHJhbmRvbVRpbWVvdXQsXG4gICAge1xuICAgICAgJy8nOiBbXG4gICAgICAgIHJhbmRvbVRpbWVvdXQsXG4gICAgICAgIHtcbiAgICAgICAgICAnLyc6IFtcbiAgICAgICAgICAgIHJhbmRvbVRpbWVvdXQsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICcvJzogW1xuICAgICAgICAgICAgICAgIHJhbmRvbVRpbWVvdXQsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJy8nOiBbXG4gICAgICAgICAgICAgICAgICAgIHJhbmRvbVRpbWVvdXQsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnLyc6ICdmb28nXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIF0sXG4gICcvYmFyJzogJ2Jhcidcbn0pXG5cbmNsYXNzIFZpZXdNb2RlbCB7XG4gIHB1YmxpYyBpc0xvYWRpbmcgPSBMT0FESU5HXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJhbmRvbVRpbWVvdXQoKSB7XG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIHJhbmRvbSgxMDAwKSkpXG59XG5cbmtvLmNvbXBvbmVudHMucmVnaXN0ZXIoJ2xvYWRpbmctYW5pbWF0aW9uJywgeyB2aWV3TW9kZWw6IFZpZXdNb2RlbCwgdGVtcGxhdGUgfSlcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9sb2FkaW5nLWFuaW1hdGlvbi9pbmRleC50cyJdLCJzb3VyY2VSb290IjoiIn0=