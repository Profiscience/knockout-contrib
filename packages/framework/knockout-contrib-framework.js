(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('knockout')) :
	typeof define === 'function' && define.amd ? define(['exports', 'knockout'], factory) :
	(factory((global.ko = global.ko || {}, global.ko.contrib = global.ko.contrib || {}, global.ko.contrib.framework = {}),global.ko));
}(this, (function (exports,ko) { 'use strict';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
/* global Reflect, Promise */

var extendStatics = Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
    function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };

function __extends(d, b) {
    extendStatics(d, b);
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = Object.assign || function __assign(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};









function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}



function __values(o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spread() {
    for (var ar = [], i = 0; i < arguments.length; i++)
        ar = ar.concat(__read(arguments[i]));
    return ar;
}

/**
 * Makes a property non-enumerable. NOT A DECORATOR.
 *
 * Excluded from Object.keys, JSON.stringify, etc; you only find it if you're looking for it.
 *
 * Useful in classes derived from DataModelConstructorBuilder to exclude from `.toJS()`.
 *
 * Example usage
 * ```typescript
 *  import { utils } from '@profiscience/framework'
 *
 *  const obj = {
 *    foo: true,
 *    bar: true,
 *    dontInclude: true,
 *    baz: true
 *  }
 *
 *  utils.nonenumerable(obj, 'dontInclude')
 *
 *  Object.keys(obj) === ['foo', 'bar', 'baz']
 * ```
 * @param target object with property, e.g. target[prop]
 * @param prop property name
 */
function nonenumerable(target, prop) {
    Object.defineProperty(target, prop, __assign({}, Object.getOwnPropertyDescriptor(target, prop) || {}, { enumerable: false }));
}


var utils = Object.freeze({
	nonenumerable: nonenumerable
});

// can't accurately type this without conditional mapped types
// see: https://github.com/Microsoft/TypeScript/issues/12424
function fromJS(obj, mapArraysDeep, _parentIsArray) {
    if (mapArraysDeep === void 0) { mapArraysDeep = false; }
    if (_parentIsArray === void 0) { _parentIsArray = false; }
    if (ko.isObservable(obj)) {
        return obj;
    }
    else if (obj instanceof Array) {
        var _arr = [];
        for (var i = 0; i < obj.length; i++) {
            _arr[i] = fromJS(obj[i], mapArraysDeep, true);
        }
        return ko.observableArray(_arr);
    }
    else if (obj instanceof Date || obj instanceof RegExp) {
        return ko.observable(obj);
    }
    else if (obj instanceof Function) {
        return obj;
    }
    else if (obj instanceof Object) {
        var obs = {};
        for (var _i = 0, _a = Object.keys(obj); _i < _a.length; _i++) {
            var p = _a[_i];
            obs[p] = fromJS(obj[p], mapArraysDeep);
        }
        return obs;
    }
    else {
        return _parentIsArray && !mapArraysDeep ? obj : ko.observable(obj);
    }
}

function merge(dest, src, mapArraysDeep) {
    if (mapArraysDeep === void 0) { mapArraysDeep = false; }
    var props = Object.keys(src);
    for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
        var prop = props_1[_i];
        if (isUndefined$1(dest[prop])) {
            dest[prop] = fromJS(src[prop], src[prop] instanceof Array && mapArraysDeep);
        }
        else if (ko.isObservable(dest[prop])) {
            dest[prop](src[prop] instanceof Array && mapArraysDeep
                ? ko.unwrap(fromJS(src[prop], true))
                : src[prop]);
        }
        else if (isUndefined$1(src[prop])) {
            dest[prop] = undefined;
        }
        else if (src[prop].constructor === Object) {
            merge(dest[prop], src[prop], mapArraysDeep);
        }
        else {
            dest[prop] = src[prop];
        }
    }
    return dest;
}
function isUndefined$1(foo) {
    return typeof foo === 'undefined';
}

/**
 * See Constructor Builders concept in the README
 */
var ConstructorBuilder = /** @class */ (function () {
    function ConstructorBuilder() {
    }
    /**
     * Dynamically applies mixins and returns a new constructor using the following pattern:
     *
     * ```typescript
     * class MyModel extends ConstructorBuilder.Mixin(myMixin) {}
     * ```
     *
     * @param mixin Mixin to apply to constructor
     */
    ConstructorBuilder.Mixin = function (mixin) {
        return mixin(this);
    };
    return ConstructorBuilder;
}());

var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = _freeGlobal || freeSelf || Function('return this')();

var _root = root;

/** Built-in value references. */
var Symbol$1 = _root.Symbol;

var _Symbol = Symbol$1;

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
var symToStringTag$1 = _Symbol ? _Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

var _getRawTag = getRawTag;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString$1.call(value);
}

var _objectToString = objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]';
var undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = _Symbol ? _Symbol.toStringTag : undefined;

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
    ? _getRawTag(value)
    : _objectToString(value);
}

var _baseGetTag = baseGetTag;

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

var isObject_1 = isObject;

/** `Object#toString` result references. */
var asyncTag = '[object AsyncFunction]';
var funcTag = '[object Function]';
var genTag = '[object GeneratorFunction]';
var proxyTag = '[object Proxy]';

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
  if (!isObject_1(value)) {
    return false;
  }
  // The use of `Object#toString` avoids issues with the `typeof` operator
  // in Safari 9 which returns 'object' for typed arrays and other constructors.
  var tag = _baseGetTag(value);
  return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
}

var isFunction_1 = isFunction;

/**
 * Symbol to access subscriptions on viewModel instance
 */
var SUBSCRIPTIONS = Symbol('SUBSCRIPTIONS');
/**
 * Adds .subscribe(obs, fn) and .dispose() methods with subscription tracking to prevent leaks
 *
 * Used by constructor builders
 *
 * @param ctor BaseModel
 */
function SubscriptionDisposalMixin(ctor) {
    return /** @class */ (function (_super) {
        __extends(Subscribable, _super);
        function Subscribable() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var _this = _super.apply(this, __spread(args)) || this;
            _this[SUBSCRIPTIONS] = [];
            return _this;
        }
        Subscribable.prototype.subscribe = function (arg, fn) {
            var obs;
            if (ko.isObservable(arg)) {
                obs = arg;
            }
            else if (isFunction_1(arg)) {
                obs = ko.pureComputed(arg);
            }
            else {
                obs = ko.pureComputed(function () { return ko.toJS(arg); });
            }
            var sub = obs.subscribe(function (newVal) { fn(newVal); });
            this[SUBSCRIPTIONS].push(sub);
            return sub;
        };
        /**
         * Dispose all subscriptions
         */
        Subscribable.prototype.dispose = function () {
            this[SUBSCRIPTIONS].forEach(function (sub) { return sub.dispose(); });
        };
        return Subscribable;
    }(ctor));
}

/**
 * Symbol for accessing initialization promise
 */
var INITIALIZED = Symbol('INITIALIZED');
/**
 * Creates a DataModel constructor with support for async initialization that updates
 * observable properties in derived class when params are changed.
 *
 * Example usage:
 *
 * ```typescript
 * import { observable } from 'knockout-decorators'
 *
 * type MyDataModelParams = {}
 *
 * class MyDataModel extends DataModelConstructorBuilder
 *   // using a mixin to provide `fetch`
 *   .Mixin(RESTMixin('https://example.com/some/api/endpoint'))
 *
 *   // define params type
 *   <MyDataModelParams>{
 *
 *   // define which properties should be observable using decorators
 *   @observable
 *   public somePropertyInAPIResponseThatShouldBeObservable: string
 *   // define non-observable props too for type-safety/autocomplete
 *   public somePropertyInAPIResponseThatShouldNotBeObservable: string
 *
 *   // using a custom fetch method
 *   protected async fetch() {
 *     return await $.get('https://example.com/some/api/endpoint')
 *   }
 * }
 *
 * const model = await MyDataModel.create()
 *
 * model.dispose()
 * ```
 */
var DataModelConstructorBuilder = /** @class */ (function (_super) {
    __extends(DataModelConstructorBuilder, _super);
    /**
     * Constructs a new DataModel instance
     *
     * @param params Parameters for the current model state. If observable, will trigger
     *  updates to observable properties when modified
     */
    function DataModelConstructorBuilder(params) {
        var _this = _super.call(this) || this;
        _this.params = params;
        /**
         * True if pending `.fetch()` response
         */
        _this.loading = ko.observable(true);
        nonenumerable(_this, 'params');
        nonenumerable(_this, 'loading');
        // we want to keep this mostly hidden as an implementation detail, and to make it work
        // an index property has to be added which compromises type safety
        var initialized = _this.update();
        _this[INITIALIZED] = initialized;
        initialized
            .then(function () {
            _this.subscribe(params, function () { return _this.update(); });
        })
            .catch(function () {
            // tslint:disable-next-line no-console
            console.error('Error initializing DataModel');
        });
        return _this;
    }
    /**
     * Return enumerable properties, unwrapped
     */
    DataModelConstructorBuilder.prototype.toJS = function () {
        var obj = {};
        try {
            for (var _a = __values(Object.keys(this)), _b = _a.next(); !_b.done; _b = _a.next()) {
                var k = _b.value;
                obj[k] = this[k];
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return ko.toJS(obj);
        var e_1, _c;
    };
    DataModelConstructorBuilder.prototype.update = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        this.loading(true);
                        _a = merge;
                        _b = [this];
                        return [4 /*yield*/, this.fetch()];
                    case 1:
                        _a.apply(void 0, _b.concat([_c.sent()]));
                        this.loading(false);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Abstract method that defines how data is retrieved, typically AJAX.
     *
     * Should use `this.params`, if applicable.
     *
     * @abstract
     */
    DataModelConstructorBuilder.prototype.fetch = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new Error('fetch is not implemented in derived class');
            });
        });
    };
    /**
     * Factory for instantiating a model and waiting for the initial fetch to complete
     *
     * @param params (Optionally) observable parameters for this instance. Will be passed to the constructor.
     */
    DataModelConstructorBuilder.create = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var instance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        instance = Reflect.construct(this, [params]);
                        return [4 /*yield*/, instance[INITIALIZED]];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, instance];
                }
            });
        });
    };
    return DataModelConstructorBuilder;
}(ConstructorBuilder.Mixin(SubscriptionDisposalMixin)));

var uniqueComponentNames = (function () {
    var i, id;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                i = 0;
                _a.label = 1;
            case 1:
                
                id = "__router_view_" + i++ + "__";
                if (ko.components.isRegistered(id)) {
                    return [3 /*break*/, 1];
                }
                return [4 /*yield*/, id];
            case 2:
                _a.sent();
                return [3 /*break*/, 1];
            case 3: return [2 /*return*/];
        }
    });
})();
function createComponentMiddleware(getComponent) {
    return function (ctx) {
        var _this = this;
        var component, componentName, initializeComponentPromise;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    component = getComponent();
                    componentName = uniqueComponentNames.next().value;
                    ctx.route.component = componentName;
                    initializeComponentPromise = fetchComponent(component)
                        .then(function (_a) {
                        var template = _a.template, ViewModel = _a.viewModel;
                        return __awaiter(_this, void 0, void 0, function () {
                            var componentConfig, instance;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        componentConfig = {
                                            synchronous: true,
                                            template: template
                                        };
                                        if (!ViewModel) return [3 /*break*/, 2];
                                        instance = new ViewModel(ctx);
                                        ctx.viewModel = instance;
                                        return [4 /*yield*/, initializeViewModel(instance)];
                                    case 1:
                                        _b.sent();
                                        componentConfig.viewModel = {
                                            instance: instance
                                        };
                                        _b.label = 2;
                                    case 2:
                                        componentConfig.synchronous = true;
                                        ko.components.register(componentName, componentConfig);
                                        return [2 /*return*/];
                                }
                            });
                        });
                    });
                    ctx.queue(initializeComponentPromise);
                    return [4 /*yield*/];
                case 1:
                    _a.sent();
                    /* afterRender */
                    ko.components.unregister(componentName);
                    return [2 /*return*/];
            }
        });
    };
}
function fetchComponent(accessor) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        var component, promises;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    component = {};
                    promises = Object
                        .keys(accessor)
                        .map(function (k) { return __awaiter(_this, void 0, void 0, function () {
                        var _a, _b;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _a = component;
                                    _b = k;
                                    return [4 /*yield*/, accessor[k]];
                                case 1:
                                    _a[_b] = (_c.sent()).default;
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    return [4 /*yield*/, Promise.all(promises)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, component];
            }
        });
    });
}
function initializeViewModel(vm) {
    return __awaiter(this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all(Object
                        .keys(vm)
                        .filter(function (prop) { return vm[prop][INITIALIZED]; })
                        .map(function (dataModelProp) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, vm[dataModelProp][INITIALIZED]];
                            case 1: return [2 /*return*/, _a.sent()];
                        }
                    }); }); }))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}

function createTitleMiddleware(title) {
    return function (ctx) {
        var prevTitle;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    prevTitle = document.title;
                    return [4 /*yield*/];
                case 1:
                    _a.sent();
                    /* afterRender */
                    if (typeof title === 'function') {
                        document.title = title(ctx);
                    }
                    else {
                        document.title = title;
                    }
                    return [4 /*yield*/];
                case 2:
                    _a.sent();
                    /* beforeDispose */
                    return [4 /*yield*/];
                case 3:
                    /* beforeDispose */
                    _a.sent();
                    /* afterDispose */
                    document.title = prevTitle;
                    return [2 /*return*/];
            }
        });
    };
}

/**
 * Symbol to access state name on route. Requires casting as any in TypeScript due to symbol key limitations.
 *
 * Currently only used for metaprogramming in UniversitySite, namely generating E2E state definitions.
 *
 * Example:
 *
 * ```typescript
 *  import { Route, STATE } from '@profiscience/framework'
 *
 *  const route = new Route('/', { state: 'home' })
 *
 *  route['/'][STATE] === 'home'
 * ```
 */
var STATE = Symbol('STATE');
/**
 * Creates a new route consumable by @profiscience/knockout-contrib-router.
 *
 * For convenience, Router is re-exported from @profiscience/knockout-contrib-router.
 *
 * Example:
 *
 * ```typescript
 *  import { Route, Router } from '@profiscience/framework'
 *
 *  const routes = [
 *    new Route('/', { state: 'home', component: ... }),
 *    new Route('/users', {
 *      state: 'user',
 *      children: [
 *        new Route('/', { state: 'list', component: ... }),
 *        new Route('/:id', { state: 'show', component: ... })
 *      ]
 *    })
 *  ]
 * ```
 *
 * For all available properties, see IRouteConfig
 */
var Route = /** @class */ (function () {
    function Route(path, config) {
        var normalizedConfig = [];
        if (config.title) {
            normalizedConfig.push(createTitleMiddleware(config.title));
        }
        if (config.children) {
            normalizedConfig.push(Object.assign.apply(Object, __spread([{}], config.children)));
        }
        if (config.with) {
            normalizedConfig.push(function (ctx) { return Object.assign(ctx, config.with); });
        }
        if (config.component) {
            normalizedConfig.push(createComponentMiddleware(config.component));
        }
        this[path] = normalizedConfig;
        // this is only used for meta-programming in tests for the moment
        if (config.state) {
            this[path][STATE] = config.state;
        }
    }
    return Route;
}());

/**
 * ConstructorBuilder with SubscriptionDisposalMixin, use as base for view models.
 */
var ViewModelConstructorBuilder = /** @class */ (function (_super) {
    __extends(ViewModelConstructorBuilder, _super);
    function ViewModelConstructorBuilder() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return ViewModelConstructorBuilder;
}(ConstructorBuilder.Mixin(SubscriptionDisposalMixin)));

exports.utils = utils;
exports.STATE = STATE;
exports.Route = Route;
exports.INITIALIZED = INITIALIZED;
exports.DataModelConstructorBuilder = DataModelConstructorBuilder;
exports.ViewModelConstructorBuilder = ViewModelConstructorBuilder;

Object.defineProperty(exports, '__esModule', { value: true });

})));
