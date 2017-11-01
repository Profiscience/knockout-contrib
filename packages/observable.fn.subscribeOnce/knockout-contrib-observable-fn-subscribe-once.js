(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(require('knockout')) :
	typeof define === 'function' && define.amd ? define(['knockout'], factory) :
	(factory(global.ko));
}(this, (function (ko) { 'use strict';

ko.observable.fn.subscribeOnce =
    ko.observableArray.fn.subscribeOnce =
        ko.computed.fn.subscribeOnce =
            function (fn) {
                var killMe = this.subscribe(function (v) {
                    killMe.dispose();
                    fn(v);
                });
                return killMe;
            };

})));
