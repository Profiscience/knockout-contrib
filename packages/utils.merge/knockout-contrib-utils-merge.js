(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('knockout')) :
	typeof define === 'function' && define.amd ? define(['knockout'], factory) :
	(global.ko = global.ko || {}, global.ko.utils = factory(global.ko));
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
        for (var p in obj) {
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
        if (isUndefined(dest[prop])) {
            dest[prop] = fromJS(src[prop], src[prop] instanceof Array && mapArraysDeep);
        }
        else if (ko.isObservable(dest[prop])) {
            dest[prop](src[prop] instanceof Array && mapArraysDeep
                ? ko.unwrap(fromJS(src[prop], true))
                : src[prop]);
        }
        else if (isUndefined(src[prop])) {
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
function isUndefined(foo) {
    return typeof foo === 'undefined';
}

return merge;

})));
