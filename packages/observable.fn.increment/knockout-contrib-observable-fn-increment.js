(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('knockout')) :
	typeof define === 'function' && define.amd ? define(['knockout'], factory) :
	(factory(global.ko));
}(this, (function (ko) { 'use strict';

ko.observable.fn.increment =
    ko.computed.fn.increment =
        function (amt) {
            increment(this, amt);
        };
ko.observable.fn.decrement =
    ko.computed.fn.decrement =
        function (amt) {
            decrement(this, amt);
        };
function increment(obs, amt) {
    if (amt === void 0) { amt = 1; }
    obs(obs() + amt);
}
function decrement(obs, amt) {
    if (amt === void 0) { amt = 1; }
    obs(obs() - amt);
}

})));
