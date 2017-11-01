(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('knockout')) :
	typeof define === 'function' && define.amd ? define(['knockout'], factory) :
	(factory(global.ko));
}(this, (function (ko) { 'use strict';

ko.observable.fn.toString = function () {
    return toString(this, 'Observable');
};
ko.observableArray.fn.toString = function () {
    return toString(this, 'ObservableArray');
};
ko.computed.fn.toString = function () {
    return toString(this, 'Computed');
};
function toString(obs, type) {
    return type + "(" + ko.toJSON(obs(), null) + ")";
}

})));
