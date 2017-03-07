(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('knockout')) :
	typeof define === 'function' && define.amd ? define(['exports', 'knockout'], factory) :
	(factory((global.ko = global.ko || {}, global.ko.utils = global.ko.utils || {}),global.ko));
}(this, (function (exports,ko) { 'use strict';

function fromJS(obj, mapArraysDeep, _parentIsArray) {
    if (mapArraysDeep === void 0) { mapArraysDeep = false; }
    if (_parentIsArray === void 0) { _parentIsArray = false; }
    var obs;
    if (ko.isObservable(obj)) {
        obs = obj;
    }
    else if (obj instanceof Array) {
        var _arr = [];
        for (var i = 0; i < obj.length; i++) {
            _arr[i] = fromJS(obj[i], mapArraysDeep, true);
        }
        obs = ko.observableArray(_arr);
    }
    else if (obj instanceof Date || obj instanceof RegExp) {
        obs = ko.observable(obj);
    }
    else if (obj instanceof Function) {
        obs = obj;
    }
    else if (obj instanceof Object) {
        obs = {};
        for (var p in obj) {
            obs[p] = fromJS(obj[p], mapArraysDeep);
        }
    }
    else {
        obs = _parentIsArray && !mapArraysDeep ? obj : ko.observable(obj);
    }
    return obs;
}

function defaults(dest, defaults, mapArraysDeep) {
    if (mapArraysDeep === void 0) { mapArraysDeep = false; }
    for (var prop in defaults) {
        if (isUndefined(dest[prop])) {
            dest[prop] = fromJS(defaults[prop], defaults[prop] instanceof Array && mapArraysDeep);
        }
        else if (ko.isObservable(dest[prop]) && isUndefined(dest[prop]())) {
            dest[prop](defaults[prop]);
        }
    }
    return dest;
}
function isUndefined(foo) {
    return typeof foo === 'undefined';
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

exports.defaults = defaults;
exports.fromJS = fromJS;
exports.merge = merge;

Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjpudWxsLCJzb3VyY2VzIjpbIi9Vc2Vycy9jYXNleXdlYmIvQ29kZS9rby1jb250cmliLXV0aWxzL3NyYy9mcm9tSlMudHMiLCIvVXNlcnMvY2FzZXl3ZWJiL0NvZGUva28tY29udHJpYi11dGlscy9zcmMvZGVmYXVsdHMudHMiLCIvVXNlcnMvY2FzZXl3ZWJiL0NvZGUva28tY29udHJpYi11dGlscy9zcmMvbWVyZ2UudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMga28gZnJvbSAna25vY2tvdXQnXG5pbXBvcnQgeyBLbm9ja291dE9ic2VydmFibGVUcmVlIH0gZnJvbSAnLi9fdHlwZXMnXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGZyb21KUyhcbiAgb2JqOiBhbnksXG4gIG1hcEFycmF5c0RlZXA6IGJvb2xlYW4gPSBmYWxzZSxcbiAgX3BhcmVudElzQXJyYXk6IGJvb2xlYW4gPSBmYWxzZVxuKTogS25vY2tvdXRPYnNlcnZhYmxlPGFueT4gfCBLbm9ja291dE9ic2VydmFibGVUcmVlIHtcbiAgbGV0IG9iczogS25vY2tvdXRPYnNlcnZhYmxlPGFueT4gfCBLbm9ja291dE9ic2VydmFibGVUcmVlXG5cbiAgaWYgKGtvLmlzT2JzZXJ2YWJsZShvYmopKSB7XG4gICAgb2JzID0gb2JqXG4gIH0gZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICBjb25zdCBfYXJyID0gW11cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG9iai5sZW5ndGg7IGkrKykge1xuICAgICAgX2FycltpXSA9IGZyb21KUyhvYmpbaV0sIG1hcEFycmF5c0RlZXAsIHRydWUpXG4gICAgfVxuICAgIG9icyA9IGtvLm9ic2VydmFibGVBcnJheShfYXJyKVxuICB9IGVsc2UgaWYgKG9iaiBpbnN0YW5jZW9mIERhdGUgfHwgb2JqIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgb2JzID0ga28ub2JzZXJ2YWJsZShvYmopXG4gIH0gZWxzZSBpZiAob2JqIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICBvYnMgPSBvYmpcbiAgfSBlbHNlIGlmIChvYmogaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICBvYnMgPSB7fVxuICAgIGZvciAoY29uc3QgcCBpbiBvYmopIHtcbiAgICAgIG9ic1twXSA9IGZyb21KUyhvYmpbcF0sIG1hcEFycmF5c0RlZXApXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIG9icyA9IF9wYXJlbnRJc0FycmF5ICYmICFtYXBBcnJheXNEZWVwID8gb2JqIDoga28ub2JzZXJ2YWJsZShvYmopXG4gIH1cblxuICByZXR1cm4gb2JzXG59XG4iLCJpbXBvcnQgKiBhcyBrbyBmcm9tICdrbm9ja291dCdcbmltcG9ydCB7IFBsYWluT2JqZWN0LCBLbm9ja291dE9ic2VydmFibGVUcmVlIH0gZnJvbSAnLi9fdHlwZXMnXG5pbXBvcnQgZnJvbUpTIGZyb20gJy4vZnJvbUpTJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkZWZhdWx0cyhcbiAgZGVzdDogUGxhaW5PYmplY3QsXG4gIGRlZmF1bHRzOiBQbGFpbk9iamVjdCxcbiAgbWFwQXJyYXlzRGVlcDogYm9vbGVhbiA9IGZhbHNlXG4pOiBLbm9ja291dE9ic2VydmFibGVUcmVlIHtcbiAgZm9yIChjb25zdCBwcm9wIGluIGRlZmF1bHRzKSB7XG4gICAgaWYgKGlzVW5kZWZpbmVkKGRlc3RbcHJvcF0pKSB7XG4gICAgICBkZXN0W3Byb3BdID0gZnJvbUpTKGRlZmF1bHRzW3Byb3BdLCBkZWZhdWx0c1twcm9wXSBpbnN0YW5jZW9mIEFycmF5ICYmIG1hcEFycmF5c0RlZXApXG4gICAgfSBlbHNlIGlmIChrby5pc09ic2VydmFibGUoZGVzdFtwcm9wXSkgJiYgaXNVbmRlZmluZWQoZGVzdFtwcm9wXSgpKSkge1xuICAgICAgZGVzdFtwcm9wXShkZWZhdWx0c1twcm9wXSlcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGVzdFxufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChmb28pOiBib29sZWFuIHtcbiAgcmV0dXJuIHR5cGVvZiBmb28gPT09ICd1bmRlZmluZWQnXG59XG4iLCJpbXBvcnQgKiBhcyBrbyBmcm9tICdrbm9ja291dCdcbmltcG9ydCB7IFBsYWluT2JqZWN0LCBLbm9ja291dE9ic2VydmFibGVUcmVlIH0gZnJvbSAnLi9fdHlwZXMnXG5pbXBvcnQgZnJvbUpTIGZyb20gJy4vZnJvbUpTJ1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBtZXJnZShcbiAgZGVzdDogUGxhaW5PYmplY3QsXG4gIHNyYzogUGxhaW5PYmplY3QsXG4gIG1hcEFycmF5c0RlZXA6IGJvb2xlYW4gPSBmYWxzZVxuKTogS25vY2tvdXRPYnNlcnZhYmxlVHJlZSB7XG4gIGNvbnN0IHByb3BzID0gT2JqZWN0LmtleXMoc3JjKVxuXG4gIGZvciAoY29uc3QgcHJvcCBvZiBwcm9wcykge1xuICAgIGlmIChpc1VuZGVmaW5lZChkZXN0W3Byb3BdKSkge1xuICAgICAgZGVzdFtwcm9wXSA9IGZyb21KUyhzcmNbcHJvcF0sIHNyY1twcm9wXSBpbnN0YW5jZW9mIEFycmF5ICYmIG1hcEFycmF5c0RlZXApXG4gICAgfSBlbHNlIGlmIChrby5pc09ic2VydmFibGUoZGVzdFtwcm9wXSkpIHtcbiAgICAgIGRlc3RbcHJvcF0oXG4gICAgICAgIHNyY1twcm9wXSBpbnN0YW5jZW9mIEFycmF5ICYmIG1hcEFycmF5c0RlZXBcbiAgICAgICAgICA/IGtvLnVud3JhcChmcm9tSlMoc3JjW3Byb3BdLCB0cnVlKSlcbiAgICAgICAgICA6IHNyY1twcm9wXVxuICAgICAgKVxuICAgIH0gZWxzZSBpZiAoaXNVbmRlZmluZWQoc3JjW3Byb3BdKSkge1xuICAgICAgZGVzdFtwcm9wXSA9IHVuZGVmaW5lZFxuICAgIH0gZWxzZSBpZiAoc3JjW3Byb3BdLmNvbnN0cnVjdG9yID09PSBPYmplY3QpIHtcbiAgICAgIG1lcmdlKGRlc3RbcHJvcF0sIHNyY1twcm9wXSwgbWFwQXJyYXlzRGVlcClcbiAgICB9IGVsc2Uge1xuICAgICAgZGVzdFtwcm9wXSA9IHNyY1twcm9wXVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBkZXN0XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGZvbyk6IGJvb2xlYW4ge1xuICByZXR1cm4gdHlwZW9mIGZvbyA9PT0gJ3VuZGVmaW5lZCdcbn1cbiJdLCJuYW1lcyI6WyJrby5pc09ic2VydmFibGUiLCJrby5vYnNlcnZhYmxlQXJyYXkiLCJrby5vYnNlcnZhYmxlIiwiaXNVbmRlZmluZWQiLCJrby51bndyYXAiXSwibWFwcGluZ3MiOiI7Ozs7OztnQkFJRSxHQUFRLEVBQ1IsYUFBOEIsRUFDOUIsY0FBK0I7SUFEL0IsOEJBQUEsRUFBQSxxQkFBOEI7SUFDOUIsK0JBQUEsRUFBQSxzQkFBK0I7SUFFL0IsSUFBSSxHQUFxRCxDQUFBO0lBRXpELElBQUlBLGVBQWUsQ0FBQyxHQUFHLENBQUMsRUFBRTtRQUN4QixHQUFHLEdBQUcsR0FBRyxDQUFBO0tBQ1Y7U0FBTSxJQUFJLEdBQUcsWUFBWSxLQUFLLEVBQUU7UUFDL0IsSUFBTSxJQUFJLEdBQUcsRUFBRSxDQUFBO1FBQ2YsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDbkMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFBO1NBQzlDO1FBQ0QsR0FBRyxHQUFHQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUMvQjtTQUFNLElBQUksR0FBRyxZQUFZLElBQUksSUFBSSxHQUFHLFlBQVksTUFBTSxFQUFFO1FBQ3ZELEdBQUcsR0FBR0MsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQ3pCO1NBQU0sSUFBSSxHQUFHLFlBQVksUUFBUSxFQUFFO1FBQ2xDLEdBQUcsR0FBRyxHQUFHLENBQUE7S0FDVjtTQUFNLElBQUksR0FBRyxZQUFZLE1BQU0sRUFBRTtRQUNoQyxHQUFHLEdBQUcs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