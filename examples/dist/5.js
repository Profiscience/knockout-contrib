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

/***/ 237:
/***/ (function(module, exports, __webpack_require__) {

var baseRandom = __webpack_require__(238),
    isIterateeCall = __webpack_require__(90),
    toFinite = __webpack_require__(91);

/** Built-in method references without a dependency on `root`. */
var freeParseFloat = parseFloat;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMin = Math.min,
    nativeRandom = Math.random;

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
    } else {
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

/***/ 238:
/***/ (function(module, exports) {

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeFloor = Math.floor,
    nativeRandom = Math.random;

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

/***/ 239:
/***/ (function(module, exports) {

/* 
** ToProgress v0.1.1
** http://github.com/djyde/ToProgress
*/

// Animation Detection
function whichTransitionEvent(){
  var t,
      el = document.createElement("fakeelement");

  var transitions = {
    "transition"      : "transitionend",
    "OTransition"     : "oTransitionEnd",
    "MozTransition"   : "transitionend",
    "WebkitTransition": "webkitTransitionEnd"
  }

  for (t in transitions){
    if (el.style[t] !== undefined){
      return transitions[t];
    }
  }
}

var transitionEvent = whichTransitionEvent();

var ToProgress = function(opt, selector) {
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
  this.progressBar.setCSS = function(style) {
    for(var property in style){
      this.style[property] = style[property];
    }
  }
  this.progressBar.setCSS({
    "position": selector ? "relative" : "fixed",
    "top": this.options.position === 'top' ? "0" : 'auto' ,
    "bottom": this.options.position === 'bottom' ? "0" : 'auto' ,
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
      } else {
        el.appendChild(this.progressBar);
      }
    }
  } else {
    document.body.appendChild(this.progressBar);
  }
}

ToProgress.prototype.transit = function() {
  this.progressBar.style.width = this.progress + '%';
}

ToProgress.prototype.getProgress = function() {
  return this.progress;
}

ToProgress.prototype.setProgress = function(progress, callback) {
  this.show();
  if (progress > 100) {
    this.progress = 100;
  } else if (progress < 0) {
    this.progress = 0;
  } else {
    this.progress = progress;
  }
  this.transit();
  callback && callback();
}

ToProgress.prototype.increase = function(toBeIncreasedProgress, callback) {
  this.show();
  this.setProgress(this.progress + toBeIncreasedProgress, callback);
}

ToProgress.prototype.decrease = function(toBeDecreasedProgress, callback) {
  this.show();
  this.setProgress(this.progress - toBeDecreasedProgress, callback);
}

ToProgress.prototype.finish = function(callback) {
  var that = this;
  this.setProgress(100, callback);
  this.hide();
  transitionEvent && this.progressBar.addEventListener(transitionEvent, function(e) {
    that.reset();
    that.progressBar.removeEventListener(e.type, arguments.callee);
  });
}

ToProgress.prototype.reset = function(callback) {
  this.progress = 0;
  this.transit();
  callback && callback();
}

ToProgress.prototype.hide = function() {
  this.progressBar.style.opacity = '0';
}

ToProgress.prototype.show = function() {
  this.progressBar.style.opacity = '1';
}

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
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_random__ = __webpack_require__(237);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_random___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_random__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_knockout__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_knockout___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_knockout__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_toprogress__ = __webpack_require__(239);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9wYWNrYWdlcy9yb3V0ZXIvZXhhbXBsZXMvbG9hZGluZy1hbmltYXRpb24vdmlld3MvZm9vL3RlbXBsYXRlLmh0bWwiLCJ3ZWJwYWNrOi8vLy4vcGFja2FnZXMvcm91dGVyL2V4YW1wbGVzL2xvYWRpbmctYW5pbWF0aW9uL3ZpZXdzL2Jhci90ZW1wbGF0ZS5odG1sIiwid2VicGFjazovLy8uL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9sb2FkaW5nLWFuaW1hdGlvbi9pbmRleC5odG1sIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvcmFuZG9tLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VSYW5kb20uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3RvcHJvZ3Jlc3MvbGliL3RvcHJvZ3Jlc3MuanMiLCJ3ZWJwYWNrOi8vLy4vcGFja2FnZXMvcm91dGVyL2V4YW1wbGVzL2xvYWRpbmctYW5pbWF0aW9uL3ZpZXdzL2Zvby9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9wYWNrYWdlcy9yb3V0ZXIvZXhhbXBsZXMvbG9hZGluZy1hbmltYXRpb24vdmlld3MvYmFyL2luZGV4LnRzIiwid2VicGFjazovLy8uL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9sb2FkaW5nLWFuaW1hdGlvbi9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLDBGOzs7Ozs7O0FDQUEsMEY7Ozs7Ozs7QUNBQSxnREFBZ0Qsc0JBQXNCLGFBQWEsY0FBYyxtQkFBbUIsa0JBQWtCLHVDQUF1QyxtQkFBbUIsS0FBSyw2QkFBNkIsa0NBQWtDLGVBQWUseUJBQXlCLGtCQUFrQixrQkFBa0IseUJBQXlCLEtBQUssbUNBQW1DLHNCQUFzQixpQkFBaUIsNEJBQTRCLHFCQUFxQixLQUFLLHNCQUFzQixVQUFVLG1CQUFtQixzQ0FBc0MsT0FBTyxXQUFXLG1CQUFtQixtQ0FBbUMsT0FBTyxZQUFZ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QWE7d0NBQ2I7NENBQ0UsR0FBRyxFQUFFLEtBQUs7eUNBQ1g7cUNBQ0Y7aUNBQ0Y7NkJBQ0Y7eUJBQ0Y7cUJBQ0Y7aUJBQ0Y7YUFDRjtTQUNGO0tBQ0Y7SUFDRCxNQUFNLEVBQUUsS0FBSztDQUNkLENBQUM7QUFFRjtJQUFBO1FBQ1MsY0FBUyxHQUFHLE9BQU87SUFDNUIsQ0FBQztJQUFELGdCQUFDO0FBQUQsQ0FBQztBQUVEOzs7O3dCQUNFLHFCQUFNLElBQUksT0FBTyxDQUFDLFVBQUMsT0FBTyxJQUFLLGlCQUFVLENBQUMsT0FBTyxFQUFFLHFEQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBakMsQ0FBaUMsQ0FBQzs7b0JBQWpFLFNBQWlFOzs7OztDQUNsRTtBQUVELG9EQUFhLENBQUMsUUFBUSxDQUFDLG1CQUFtQixFQUFFLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxRQUFRLHVEQUFFLENBQUMiLCJmaWxlIjoiNS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZS5leHBvcnRzID0gXCI8aDE+Zm9vPC9oMT5cXG5cXG48aHI+XFxuXFxuPGEgZGF0YS1iaW5kPVxcXCJwYXRoOiAnLy9iYXInXFxcIj5nbyB0byBiYXI8L2E+XFxuXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wYWNrYWdlcy9yb3V0ZXIvZXhhbXBsZXMvbG9hZGluZy1hbmltYXRpb24vdmlld3MvZm9vL3RlbXBsYXRlLmh0bWxcbi8vIG1vZHVsZSBpZCA9IDIyMlxuLy8gbW9kdWxlIGNodW5rcyA9IDUgMTAgMjEiLCJtb2R1bGUuZXhwb3J0cyA9IFwiPGgxPmJhcjwvaDE+XFxuXFxuPGhyPlxcblxcbjxhIGRhdGEtYmluZD1cXFwicGF0aDogJy8vZm9vJ1xcXCI+Z28gdG8gZm9vPC9hPlxcblwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vcGFja2FnZXMvcm91dGVyL2V4YW1wbGVzL2xvYWRpbmctYW5pbWF0aW9uL3ZpZXdzL2Jhci90ZW1wbGF0ZS5odG1sXG4vLyBtb2R1bGUgaWQgPSAyMjNcbi8vIG1vZHVsZSBjaHVua3MgPSA1IDExIDIyIiwibW9kdWxlLmV4cG9ydHMgPSBcIlxcbjxzdHlsZT5cXG4gIC5vdmVybGF5LWxvYWRlciB7XFxuICAgIHBvc2l0aW9uOiBmaXhlZDtcXG4gICAgdG9wOiAwO1xcbiAgICBsZWZ0OiAwO1xcbiAgICBoZWlnaHQ6IDEwMCU7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwyNTUsMjU1LC44KTtcXG4gICAgei1pbmRleDogOTk5O1xcbiAgfVxcblxcbiAgLm92ZXJsYXktbG9hZGVyLWlubmVyIHtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO1xcbiAgICB0b3A6IDUwJTtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgY29sb3I6ICNGRkY7XFxuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIH1cXG5cXG4gIC5vdmVybGF5LWxvYWRlci1pbm5lciBsYWJlbCB7XFxuICAgIGZvbnQtc2l6ZTogMjBweDtcXG4gICAgb3BhY2l0eTogMDtcXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgICBjb2xvcjogIzgxYjVlYztcXG4gIH1cXG5cXG4gIEBrZXlmcmFtZXMgbG9sIHtcXG4gICAgMCUge1xcbiAgICAgIG9wYWNpdHk6IDA7XFxuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKC0zMDBweCk7XFxuICAgIH1cXG4gICAgNTAlIHtcXG4gICAgICBvcGFjaXR5OiAxO1xcbiAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgwcHgpO1xcbiAgICB9XFxuICAgIDEwMCUge1xcbiAgICAgIG9wYWNpdHk6IDA7XFxuICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDMwMHB4KTtcXG4gICAgfVxcbiAgfVxcblxcbiAgLm92ZXJsYXktbG9hZGVyLWlubmVyIGxhYmVsOm50aC1jaGlsZCg2KSB7XFxuICAgIGFuaW1hdGlvbjogbG9sIDJzIGluZmluaXRlIGVhc2UtaW4tb3V0O1xcbiAgfVxcblxcbiAgLm92ZXJsYXktbG9hZGVyLWlubmVyIGxhYmVsOm50aC1jaGlsZCg1KSB7XFxuICAgIGFuaW1hdGlvbjogbG9sIDJzIDEwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0O1xcbiAgfVxcblxcbiAgLm92ZXJsYXktbG9hZGVyLWlubmVyIGxhYmVsOm50aC1jaGlsZCg0KSB7XFxuICAgIGFuaW1hdGlvbjogbG9sIDJzIDIwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0O1xcbiAgfVxcblxcbiAgLm92ZXJsYXktbG9hZGVyLWlubmVyIGxhYmVsOm50aC1jaGlsZCgzKSB7XFxuICAgIGFuaW1hdGlvbjogbG9sIDJzIDMwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0O1xcbiAgfVxcblxcbiAgLm92ZXJsYXktbG9hZGVyLWlubmVyIGxhYmVsOm50aC1jaGlsZCgyKSB7XFxuICAgIGFuaW1hdGlvbjogbG9sIDJzIDQwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0O1xcbiAgfVxcblxcbiAgLm92ZXJsYXktbG9hZGVyLWlubmVyIGxhYmVsOm50aC1jaGlsZCgxKSB7XFxuICAgIGFuaW1hdGlvbjogbG9sIDJzIDUwMG1zIGluZmluaXRlIGVhc2UtaW4tb3V0O1xcbiAgfVxcbjwvc3R5bGU+XFxuXFxuPGRpdiBjbGFzcz1cXFwib3ZlcmxheS1sb2FkZXJcXFwiIGRhdGEtYmluZD1cXFwidmlzaWJsZTogaXNMb2FkaW5nXFxcIj5cXG4gIDxkaXYgY2xhc3M9XFxcIm92ZXJsYXktbG9hZGVyLWlubmVyXFxcIj5cXG4gICAgPGxhYmVsPiYjOTY3OTs8L2xhYmVsPlxcbiAgICA8bGFiZWw+JiM5Njc5OzwvbGFiZWw+XFxuICAgIDxsYWJlbD4mIzk2Nzk7PC9sYWJlbD5cXG4gICAgPGxhYmVsPiYjOTY3OTs8L2xhYmVsPlxcbiAgICA8bGFiZWw+JiM5Njc5OzwvbGFiZWw+XFxuICAgIDxsYWJlbD4mIzk2Nzk7PC9sYWJlbD5cXG4gIDwvZGl2PlxcbjwvZGl2Plxcblxcbjxyb3V0ZXI+PC9yb3V0ZXI+XCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9wYWNrYWdlcy9yb3V0ZXIvZXhhbXBsZXMvbG9hZGluZy1hbmltYXRpb24vaW5kZXguaHRtbFxuLy8gbW9kdWxlIGlkID0gMjMwXG4vLyBtb2R1bGUgY2h1bmtzID0gNSAyMyIsInZhciBiYXNlUmFuZG9tID0gcmVxdWlyZSgnLi9fYmFzZVJhbmRvbScpLFxuICAgIGlzSXRlcmF0ZWVDYWxsID0gcmVxdWlyZSgnLi9faXNJdGVyYXRlZUNhbGwnKSxcbiAgICB0b0Zpbml0ZSA9IHJlcXVpcmUoJy4vdG9GaW5pdGUnKTtcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VGbG9hdCA9IHBhcnNlRmxvYXQ7XG5cbi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVNaW4gPSBNYXRoLm1pbixcbiAgICBuYXRpdmVSYW5kb20gPSBNYXRoLnJhbmRvbTtcblxuLyoqXG4gKiBQcm9kdWNlcyBhIHJhbmRvbSBudW1iZXIgYmV0d2VlbiB0aGUgaW5jbHVzaXZlIGBsb3dlcmAgYW5kIGB1cHBlcmAgYm91bmRzLlxuICogSWYgb25seSBvbmUgYXJndW1lbnQgaXMgcHJvdmlkZWQgYSBudW1iZXIgYmV0d2VlbiBgMGAgYW5kIHRoZSBnaXZlbiBudW1iZXJcbiAqIGlzIHJldHVybmVkLiBJZiBgZmxvYXRpbmdgIGlzIGB0cnVlYCwgb3IgZWl0aGVyIGBsb3dlcmAgb3IgYHVwcGVyYCBhcmVcbiAqIGZsb2F0cywgYSBmbG9hdGluZy1wb2ludCBudW1iZXIgaXMgcmV0dXJuZWQgaW5zdGVhZCBvZiBhbiBpbnRlZ2VyLlxuICpcbiAqICoqTm90ZToqKiBKYXZhU2NyaXB0IGZvbGxvd3MgdGhlIElFRUUtNzU0IHN0YW5kYXJkIGZvciByZXNvbHZpbmdcbiAqIGZsb2F0aW5nLXBvaW50IHZhbHVlcyB3aGljaCBjYW4gcHJvZHVjZSB1bmV4cGVjdGVkIHJlc3VsdHMuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjcuMFxuICogQGNhdGVnb3J5IE51bWJlclxuICogQHBhcmFtIHtudW1iZXJ9IFtsb3dlcj0wXSBUaGUgbG93ZXIgYm91bmQuXG4gKiBAcGFyYW0ge251bWJlcn0gW3VwcGVyPTFdIFRoZSB1cHBlciBib3VuZC5cbiAqIEBwYXJhbSB7Ym9vbGVhbn0gW2Zsb2F0aW5nXSBTcGVjaWZ5IHJldHVybmluZyBhIGZsb2F0aW5nLXBvaW50IG51bWJlci5cbiAqIEByZXR1cm5zIHtudW1iZXJ9IFJldHVybnMgdGhlIHJhbmRvbSBudW1iZXIuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8ucmFuZG9tKDAsIDUpO1xuICogLy8gPT4gYW4gaW50ZWdlciBiZXR3ZWVuIDAgYW5kIDVcbiAqXG4gKiBfLnJhbmRvbSg1KTtcbiAqIC8vID0+IGFsc28gYW4gaW50ZWdlciBiZXR3ZWVuIDAgYW5kIDVcbiAqXG4gKiBfLnJhbmRvbSg1LCB0cnVlKTtcbiAqIC8vID0+IGEgZmxvYXRpbmctcG9pbnQgbnVtYmVyIGJldHdlZW4gMCBhbmQgNVxuICpcbiAqIF8ucmFuZG9tKDEuMiwgNS4yKTtcbiAqIC8vID0+IGEgZmxvYXRpbmctcG9pbnQgbnVtYmVyIGJldHdlZW4gMS4yIGFuZCA1LjJcbiAqL1xuZnVuY3Rpb24gcmFuZG9tKGxvd2VyLCB1cHBlciwgZmxvYXRpbmcpIHtcbiAgaWYgKGZsb2F0aW5nICYmIHR5cGVvZiBmbG9hdGluZyAhPSAnYm9vbGVhbicgJiYgaXNJdGVyYXRlZUNhbGwobG93ZXIsIHVwcGVyLCBmbG9hdGluZykpIHtcbiAgICB1cHBlciA9IGZsb2F0aW5nID0gdW5kZWZpbmVkO1xuICB9XG4gIGlmIChmbG9hdGluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgaWYgKHR5cGVvZiB1cHBlciA9PSAnYm9vbGVhbicpIHtcbiAgICAgIGZsb2F0aW5nID0gdXBwZXI7XG4gICAgICB1cHBlciA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIGxvd2VyID09ICdib29sZWFuJykge1xuICAgICAgZmxvYXRpbmcgPSBsb3dlcjtcbiAgICAgIGxvd2VyID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuICBpZiAobG93ZXIgPT09IHVuZGVmaW5lZCAmJiB1cHBlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgbG93ZXIgPSAwO1xuICAgIHVwcGVyID0gMTtcbiAgfVxuICBlbHNlIHtcbiAgICBsb3dlciA9IHRvRmluaXRlKGxvd2VyKTtcbiAgICBpZiAodXBwZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdXBwZXIgPSBsb3dlcjtcbiAgICAgIGxvd2VyID0gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgdXBwZXIgPSB0b0Zpbml0ZSh1cHBlcik7XG4gICAgfVxuICB9XG4gIGlmIChsb3dlciA+IHVwcGVyKSB7XG4gICAgdmFyIHRlbXAgPSBsb3dlcjtcbiAgICBsb3dlciA9IHVwcGVyO1xuICAgIHVwcGVyID0gdGVtcDtcbiAgfVxuICBpZiAoZmxvYXRpbmcgfHwgbG93ZXIgJSAxIHx8IHVwcGVyICUgMSkge1xuICAgIHZhciByYW5kID0gbmF0aXZlUmFuZG9tKCk7XG4gICAgcmV0dXJuIG5hdGl2ZU1pbihsb3dlciArIChyYW5kICogKHVwcGVyIC0gbG93ZXIgKyBmcmVlUGFyc2VGbG9hdCgnMWUtJyArICgocmFuZCArICcnKS5sZW5ndGggLSAxKSkpKSwgdXBwZXIpO1xuICB9XG4gIHJldHVybiBiYXNlUmFuZG9tKGxvd2VyLCB1cHBlcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcmFuZG9tO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvbG9kYXNoL3JhbmRvbS5qc1xuLy8gbW9kdWxlIGlkID0gMjM3XG4vLyBtb2R1bGUgY2h1bmtzID0gNSIsIi8qIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIGZvciB0aG9zZSB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgb3RoZXIgYGxvZGFzaGAgbWV0aG9kcy4gKi9cbnZhciBuYXRpdmVGbG9vciA9IE1hdGguZmxvb3IsXG4gICAgbmF0aXZlUmFuZG9tID0gTWF0aC5yYW5kb207XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYF8ucmFuZG9tYCB3aXRob3V0IHN1cHBvcnQgZm9yIHJldHVybmluZ1xuICogZmxvYXRpbmctcG9pbnQgbnVtYmVycy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHtudW1iZXJ9IGxvd2VyIFRoZSBsb3dlciBib3VuZC5cbiAqIEBwYXJhbSB7bnVtYmVyfSB1cHBlciBUaGUgdXBwZXIgYm91bmQuXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSByYW5kb20gbnVtYmVyLlxuICovXG5mdW5jdGlvbiBiYXNlUmFuZG9tKGxvd2VyLCB1cHBlcikge1xuICByZXR1cm4gbG93ZXIgKyBuYXRpdmVGbG9vcihuYXRpdmVSYW5kb20oKSAqICh1cHBlciAtIGxvd2VyICsgMSkpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGJhc2VSYW5kb207XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2Jhc2VSYW5kb20uanNcbi8vIG1vZHVsZSBpZCA9IDIzOFxuLy8gbW9kdWxlIGNodW5rcyA9IDUiLCIvKiBcbioqIFRvUHJvZ3Jlc3MgdjAuMS4xXG4qKiBodHRwOi8vZ2l0aHViLmNvbS9kanlkZS9Ub1Byb2dyZXNzXG4qL1xuXG4vLyBBbmltYXRpb24gRGV0ZWN0aW9uXG5mdW5jdGlvbiB3aGljaFRyYW5zaXRpb25FdmVudCgpe1xuICB2YXIgdCxcbiAgICAgIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImZha2VlbGVtZW50XCIpO1xuXG4gIHZhciB0cmFuc2l0aW9ucyA9IHtcbiAgICBcInRyYW5zaXRpb25cIiAgICAgIDogXCJ0cmFuc2l0aW9uZW5kXCIsXG4gICAgXCJPVHJhbnNpdGlvblwiICAgICA6IFwib1RyYW5zaXRpb25FbmRcIixcbiAgICBcIk1velRyYW5zaXRpb25cIiAgIDogXCJ0cmFuc2l0aW9uZW5kXCIsXG4gICAgXCJXZWJraXRUcmFuc2l0aW9uXCI6IFwid2Via2l0VHJhbnNpdGlvbkVuZFwiXG4gIH1cblxuICBmb3IgKHQgaW4gdHJhbnNpdGlvbnMpe1xuICAgIGlmIChlbC5zdHlsZVt0XSAhPT0gdW5kZWZpbmVkKXtcbiAgICAgIHJldHVybiB0cmFuc2l0aW9uc1t0XTtcbiAgICB9XG4gIH1cbn1cblxudmFyIHRyYW5zaXRpb25FdmVudCA9IHdoaWNoVHJhbnNpdGlvbkV2ZW50KCk7XG5cbnZhciBUb1Byb2dyZXNzID0gZnVuY3Rpb24ob3B0LCBzZWxlY3Rvcikge1xuICAvLyBBdHRyaWJ1dGVzXG4gIHZhciB0aGF0ID0gdGhpcztcbiAgdGhpcy5wcm9ncmVzcyA9IDA7XG4gIHRoaXMub3B0aW9ucyA9IHtcbiAgICBpZDogJ3RvcC1wcm9ncmVzcy1iYXInLFxuICAgIGNvbG9yOiAnI0Y0NDMzNicsXG4gICAgaGVpZ2h0OiAnMnB4JyxcbiAgICBkdXJhdGlvbjogMC4yLFxuICAgIHBvc2l0aW9uOiAndG9wJ1xuICB9O1xuICBpZiAob3B0ICYmIHR5cGVvZiBvcHQgPT09ICdvYmplY3QnKSB7XG4gICAgZm9yICh2YXIga2V5IGluIG9wdCkge1xuICAgICAgdGhpcy5vcHRpb25zW2tleV0gPSBvcHRba2V5XTtcbiAgICB9XG4gIH1cbiAgdGhpcy5vcHRpb25zLm9wYWNpdHlEdXJhdGlvbiA9IHRoaXMub3B0aW9ucy5kdXJhdGlvbiAqIDM7XG4gIHRoaXMucHJvZ3Jlc3NCYXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblxuICAvLyBJbml0aWFsaXphdGlvblxuICB0aGlzLnByb2dyZXNzQmFyLmlkID0gdGhpcy5vcHRpb25zLmlkO1xuICB0aGlzLnByb2dyZXNzQmFyLnNldENTUyA9IGZ1bmN0aW9uKHN0eWxlKSB7XG4gICAgZm9yKHZhciBwcm9wZXJ0eSBpbiBzdHlsZSl7XG4gICAgICB0aGlzLnN0eWxlW3Byb3BlcnR5XSA9IHN0eWxlW3Byb3BlcnR5XTtcbiAgICB9XG4gIH1cbiAgdGhpcy5wcm9ncmVzc0Jhci5zZXRDU1Moe1xuICAgIFwicG9zaXRpb25cIjogc2VsZWN0b3IgPyBcInJlbGF0aXZlXCIgOiBcImZpeGVkXCIsXG4gICAgXCJ0b3BcIjogdGhpcy5vcHRpb25zLnBvc2l0aW9uID09PSAndG9wJyA/IFwiMFwiIDogJ2F1dG8nICxcbiAgICBcImJvdHRvbVwiOiB0aGlzLm9wdGlvbnMucG9zaXRpb24gPT09ICdib3R0b20nID8gXCIwXCIgOiAnYXV0bycgLFxuICAgIFwibGVmdFwiOiBcIjBcIixcbiAgICBcInJpZ2h0XCI6IFwiMFwiLFxuICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiB0aGlzLm9wdGlvbnMuY29sb3IsXG4gICAgXCJoZWlnaHRcIjogdGhpcy5vcHRpb25zLmhlaWdodCxcbiAgICBcIndpZHRoXCI6IFwiMCVcIixcbiAgICBcInRyYW5zaXRpb25cIjogXCJ3aWR0aCBcIiArIHRoaXMub3B0aW9ucy5kdXJhdGlvbiArIFwic1wiICsgXCIsIG9wYWNpdHkgXCIgKyB0aGlzLm9wdGlvbnMub3BhY2l0eUR1cmF0aW9uICsgXCJzXCIsXG4gICAgXCItbW96LXRyYW5zaXRpb25cIjogXCJ3aWR0aCBcIiArIHRoaXMub3B0aW9ucy5kdXJhdGlvbiArIFwic1wiICsgXCIsIG9wYWNpdHkgXCIgKyB0aGlzLm9wdGlvbnMub3BhY2l0eUR1cmF0aW9uICsgXCJzXCIsXG4gICAgXCItd2Via2l0LXRyYW5zaXRpb25cIjogXCJ3aWR0aCBcIiArIHRoaXMub3B0aW9ucy5kdXJhdGlvbiArIFwic1wiICsgXCIsIG9wYWNpdHkgXCIgKyB0aGlzLm9wdGlvbnMub3BhY2l0eUR1cmF0aW9uICsgXCJzXCJcbiAgfSk7XG5cbiAgLy8gQ3JlYXRlIHRoZSBQcm9ncmVzcyBCYXJcbiAgaWYgKHNlbGVjdG9yKSB7XG4gICAgdmFyIGVsID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzZWxlY3Rvcik7XG4gICAgaWYgKGVsKSB7XG4gICAgICBpZiAoZWwuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgIGVsLmluc2VydEJlZm9yZSh0aGlzLnByb2dyZXNzQmFyLCBlbC5maXJzdENoaWxkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsLmFwcGVuZENoaWxkKHRoaXMucHJvZ3Jlc3NCYXIpO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucHJvZ3Jlc3NCYXIpO1xuICB9XG59XG5cblRvUHJvZ3Jlc3MucHJvdG90eXBlLnRyYW5zaXQgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5wcm9ncmVzc0Jhci5zdHlsZS53aWR0aCA9IHRoaXMucHJvZ3Jlc3MgKyAnJSc7XG59XG5cblRvUHJvZ3Jlc3MucHJvdG90eXBlLmdldFByb2dyZXNzID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiB0aGlzLnByb2dyZXNzO1xufVxuXG5Ub1Byb2dyZXNzLnByb3RvdHlwZS5zZXRQcm9ncmVzcyA9IGZ1bmN0aW9uKHByb2dyZXNzLCBjYWxsYmFjaykge1xuICB0aGlzLnNob3coKTtcbiAgaWYgKHByb2dyZXNzID4gMTAwKSB7XG4gICAgdGhpcy5wcm9ncmVzcyA9IDEwMDtcbiAgfSBlbHNlIGlmIChwcm9ncmVzcyA8IDApIHtcbiAgICB0aGlzLnByb2dyZXNzID0gMDtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnByb2dyZXNzID0gcHJvZ3Jlc3M7XG4gIH1cbiAgdGhpcy50cmFuc2l0KCk7XG4gIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG59XG5cblRvUHJvZ3Jlc3MucHJvdG90eXBlLmluY3JlYXNlID0gZnVuY3Rpb24odG9CZUluY3JlYXNlZFByb2dyZXNzLCBjYWxsYmFjaykge1xuICB0aGlzLnNob3coKTtcbiAgdGhpcy5zZXRQcm9ncmVzcyh0aGlzLnByb2dyZXNzICsgdG9CZUluY3JlYXNlZFByb2dyZXNzLCBjYWxsYmFjayk7XG59XG5cblRvUHJvZ3Jlc3MucHJvdG90eXBlLmRlY3JlYXNlID0gZnVuY3Rpb24odG9CZURlY3JlYXNlZFByb2dyZXNzLCBjYWxsYmFjaykge1xuICB0aGlzLnNob3coKTtcbiAgdGhpcy5zZXRQcm9ncmVzcyh0aGlzLnByb2dyZXNzIC0gdG9CZURlY3JlYXNlZFByb2dyZXNzLCBjYWxsYmFjayk7XG59XG5cblRvUHJvZ3Jlc3MucHJvdG90eXBlLmZpbmlzaCA9IGZ1bmN0aW9uKGNhbGxiYWNrKSB7XG4gIHZhciB0aGF0ID0gdGhpcztcbiAgdGhpcy5zZXRQcm9ncmVzcygxMDAsIGNhbGxiYWNrKTtcbiAgdGhpcy5oaWRlKCk7XG4gIHRyYW5zaXRpb25FdmVudCAmJiB0aGlzLnByb2dyZXNzQmFyLmFkZEV2ZW50TGlzdGVuZXIodHJhbnNpdGlvbkV2ZW50LCBmdW5jdGlvbihlKSB7XG4gICAgdGhhdC5yZXNldCgpO1xuICAgIHRoYXQucHJvZ3Jlc3NCYXIucmVtb3ZlRXZlbnRMaXN0ZW5lcihlLnR5cGUsIGFyZ3VtZW50cy5jYWxsZWUpO1xuICB9KTtcbn1cblxuVG9Qcm9ncmVzcy5wcm90b3R5cGUucmVzZXQgPSBmdW5jdGlvbihjYWxsYmFjaykge1xuICB0aGlzLnByb2dyZXNzID0gMDtcbiAgdGhpcy50cmFuc2l0KCk7XG4gIGNhbGxiYWNrICYmIGNhbGxiYWNrKCk7XG59XG5cblRvUHJvZ3Jlc3MucHJvdG90eXBlLmhpZGUgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5wcm9ncmVzc0Jhci5zdHlsZS5vcGFjaXR5ID0gJzAnO1xufVxuXG5Ub1Byb2dyZXNzLnByb3RvdHlwZS5zaG93ID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMucHJvZ3Jlc3NCYXIuc3R5bGUub3BhY2l0eSA9ICcxJztcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUb1Byb2dyZXNzO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL3RvcHJvZ3Jlc3MvbGliL3RvcHJvZ3Jlc3MuanNcbi8vIG1vZHVsZSBpZCA9IDIzOVxuLy8gbW9kdWxlIGNodW5rcyA9IDUiLCJpbXBvcnQgKiBhcyBrbyBmcm9tICdrbm9ja291dCdcbmltcG9ydCB0ZW1wbGF0ZSBmcm9tICcuL3RlbXBsYXRlLmh0bWwnXG5cbmtvLmNvbXBvbmVudHMucmVnaXN0ZXIoJ2ZvbycsIHsgdGVtcGxhdGUgfSlcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9sb2FkaW5nLWFuaW1hdGlvbi92aWV3cy9mb28vaW5kZXgudHMiLCJpbXBvcnQgKiBhcyBrbyBmcm9tICdrbm9ja291dCdcbmltcG9ydCB0ZW1wbGF0ZSBmcm9tICcuL3RlbXBsYXRlLmh0bWwnXG5cbmtvLmNvbXBvbmVudHMucmVnaXN0ZXIoJ2JhcicsIHsgdGVtcGxhdGUgfSlcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9sb2FkaW5nLWFuaW1hdGlvbi92aWV3cy9iYXIvaW5kZXgudHMiLCJpbXBvcnQgcmFuZG9tIGZyb20gJ2xvZGFzaC9yYW5kb20nXG5pbXBvcnQgKiBhcyBrbyBmcm9tICdrbm9ja291dCdcbmltcG9ydCAqIGFzIFRvUHJvZ3Jlc3MgZnJvbSAndG9wcm9ncmVzcydcbmltcG9ydCB7IENvbnRleHQsIElDb250ZXh0LCBNaWRkbGV3YXJlLCBSb3V0ZXIgfSBmcm9tICdAcHJvZmlzY2llbmNlL2tub2Nrb3V0LWNvbnRyaWItcm91dGVyJ1xuaW1wb3J0ICcuL3ZpZXdzL2ZvbydcbmltcG9ydCAnLi92aWV3cy9iYXInXG5pbXBvcnQgdGVtcGxhdGUgZnJvbSAnLi9pbmRleC5odG1sJ1xuXG5mdW5jdGlvbiBjcmVhdGVMb2FkaW5nTWlkZGxld2FyZShpc0xvYWRpbmc6IEtub2Nrb3V0T2JzZXJ2YWJsZTxib29sZWFuPik6IE1pZGRsZXdhcmUge1xuICBsZXQgbG9hZGluZ0JhcjogVG9Qcm9ncmVzc1xuICBsZXQgbG9hZGluZ0JhckludGVydmFsOiBOb2RlSlMuVGltZXJcblxuICByZXR1cm4gZnVuY3Rpb24qKGN0eDogQ29udGV4dCAmIElDb250ZXh0KSB7XG4gICAgICAvLyBydW4gb25jZSBmb3IgdG9wLW1vc3Qgcm91dGVyXG4gICAgICBpZiAoIWxvYWRpbmdCYXIpIHtcbiAgICAgICAgLy8gdG9nZ2xlIG92ZXJsYXkgKG9ic2VydmFibGUgcGFzc2VkIGluKVxuICAgICAgICBMT0FESU5HKHRydWUpXG5cbiAgICAgICAgLy8gc3RhcnQgbG9hZGluZyBiYXJcbiAgICAgICAgbG9hZGluZ0JhciA9IG5ldyBUb1Byb2dyZXNzKHtcbiAgICAgICAgICBjb2xvcjogJyMwMDAnLFxuICAgICAgICAgIGR1cmF0aW9uOiAwLjIsXG4gICAgICAgICAgaGVpZ2h0OiAnNXB4J1xuICAgICAgICB9KVxuICAgICAgICBsb2FkaW5nQmFySW50ZXJ2YWwgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XG4gICAgICAgICAgbG9hZGluZ0Jhci5pbmNyZWFzZSgxKVxuICAgICAgICB9LCAxMDApXG4gICAgICB9XG5cbiAgICAgIHlpZWxkXG5cbiAgICAgIC8vIGVuZCBsb2FkaW5nIGluIGJvdHRvbS1tb3N0IHJvdXRlciBhZnRlclJlbmRlclxuICAgICAgaWYgKCFjdHguJGNoaWxkKSB7XG4gICAgICAgIGxvYWRpbmdCYXIuZmluaXNoKClcbiAgICAgICAgY2xlYXJJbnRlcnZhbChsb2FkaW5nQmFySW50ZXJ2YWwpXG4gICAgICAgIExPQURJTkcoZmFsc2UpXG4gICAgICAgIC8vIHJlc2V0IGZvciBuZXh0IG5hdmlnYXRpb25cbiAgICAgICAgbG9hZGluZ0JhciA9IG51bGxcbiAgICAgICAgbG9hZGluZ0JhckludGVydmFsID0gbnVsbFxuICAgICAgfVxuICB9XG59XG5cbmNvbnN0IExPQURJTkcgPSBrby5vYnNlcnZhYmxlKHRydWUpXG5cbi8vIHBhc3MgbG9hZGluZyBvYnNlcnZhYmxlIGludG8gbWlkZGxld2FyZSBmYWN0b3J5XG5Sb3V0ZXIudXNlKGNyZWF0ZUxvYWRpbmdNaWRkbGV3YXJlKExPQURJTkcpKVxuXG5Sb3V0ZXIudXNlUm91dGVzKHtcbiAgJy8nOiAoY3R4KSA9PiBjdHgucmVkaXJlY3QoJy9mb28nKSxcblxuICAvLyBzaW11bGF0ZSBhIGRlZXBseSBuZXN0ZWQgcm91dGUgdy8gdGltZW91dHMgKHdvdWxkIGJlIGFqYXggb3Igd2hhdCBoYXZlIHlvdVxuICAvLyBpbiByZWFsIGxpZmUpXG4gICcvZm9vJzogW1xuICAgIHJhbmRvbVRpbWVvdXQsXG4gICAge1xuICAgICAgJy8nOiBbXG4gICAgICAgIHJhbmRvbVRpbWVvdXQsXG4gICAgICAgIHtcbiAgICAgICAgICAnLyc6IFtcbiAgICAgICAgICAgIHJhbmRvbVRpbWVvdXQsXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICcvJzogW1xuICAgICAgICAgICAgICAgIHJhbmRvbVRpbWVvdXQsXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgJy8nOiBbXG4gICAgICAgICAgICAgICAgICAgIHJhbmRvbVRpbWVvdXQsXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAnLyc6ICdmb28nXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIF0sXG4gICcvYmFyJzogJ2Jhcidcbn0pXG5cbmNsYXNzIFZpZXdNb2RlbCB7XG4gIHB1YmxpYyBpc0xvYWRpbmcgPSBMT0FESU5HXG59XG5cbmFzeW5jIGZ1bmN0aW9uIHJhbmRvbVRpbWVvdXQoKSB7XG4gIGF3YWl0IG5ldyBQcm9taXNlKChyZXNvbHZlKSA9PiBzZXRUaW1lb3V0KHJlc29sdmUsIHJhbmRvbSgxMDAwKSkpXG59XG5cbmtvLmNvbXBvbmVudHMucmVnaXN0ZXIoJ2xvYWRpbmctYW5pbWF0aW9uJywgeyB2aWV3TW9kZWw6IFZpZXdNb2RlbCwgdGVtcGxhdGUgfSlcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3BhY2thZ2VzL3JvdXRlci9leGFtcGxlcy9sb2FkaW5nLWFuaW1hdGlvbi9pbmRleC50cyJdLCJzb3VyY2VSb290IjoiIn0=