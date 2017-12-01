(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('knockout-punches'), require('knockout'), require('jquery')) :
	typeof define === 'function' && define.amd ? define(['knockout-punches', 'knockout', 'jquery'], factory) :
	(global.ko = global.ko || {}, global.ko.bindingHandlers = global.ko.bindingHandlers || {}, global.ko.bindingHandlers.jquery = factory(null,global.ko,global.$));
}(this, (function (knockoutPunches,ko,$) { 'use strict';

$ = $ && $.hasOwnProperty('default') ? $['default'] : $;

var jqueryBinding = {
    getNamespacedHandler: function (pluginName) {
        return {
            init: function (el, valueAccessor, allBindings) {
                var value = allBindings.get('value');
                var changeHandler = allBindings.get('event.change');
                var opts = valueAccessor();
                opts = opts || {};
                $(el)[pluginName](opts);
                // @todo: find where this is being used
                $(el).change(function (e) {
                    if (typeof value === 'function') {
                        value($(el).val());
                    }
                    if (typeof changeHandler === 'function') {
                        changeHandler(e);
                    }
                });
            }
        };
    }
};
ko.bindingHandlers.jquery = jqueryBinding;

return jqueryBinding;

})));
