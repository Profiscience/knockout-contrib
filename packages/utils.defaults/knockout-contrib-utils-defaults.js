(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('knockout')) :
	typeof define === 'function' && define.amd ? define(['knockout'], factory) :
	(global.ko = global.ko || {}, global.ko.contrib = global.ko.contrib || {}, global.ko.contrib.utils = global.ko.contrib.utils || {}, global.ko.contrib.utils.defaults = factory(global.ko));
}(this, (function (ko) { 'use strict';

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

function defaults(dest, defaultValues, mapArraysDeep) {
    if (mapArraysDeep === void 0) { mapArraysDeep = false; }
    for (var prop in defaultValues) {
        if (isUndefined(dest[prop])) {
            dest[prop] = fromJS(defaultValues[prop], defaultValues[prop] instanceof Array && mapArraysDeep);
        }
        else if (ko.isObservable(dest[prop]) && isUndefined(dest[prop]())) {
            dest[prop](defaultValues[prop]);
        }
    }
    return dest;
}
function isUndefined(foo) {
    return typeof foo === 'undefined';
}

return defaults;

})));
