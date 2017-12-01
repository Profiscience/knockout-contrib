(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('knockout')) :
	typeof define === 'function' && define.amd ? define(['knockout'], factory) :
	(global.ko = global.ko || {}, global.ko.query = factory(global.ko));
}(this, (function (ko) { 'use strict';

function isBool(x) {
    return typeof x === 'boolean';
}
function isEmpty(x) {
    return x.length === 0;
}
function isNumber(x) {
    return !isNaN(parseFloat(x));
}
function isUndefined(x) {
    return typeof x === 'undefined';
}
function entries(obj) {
    return Object.keys(obj).map(function (k) { return [k, obj[k]]; });
}
function omit(obj, fn) {
    var ret = {};
    for (var _i = 0, _a = entries(obj); _i < _a.length; _i++) {
        var _b = _a[_i], k = _b[0], v = _b[1];
        if (!fn(v)) {
            ret[k] = v;
        }
    }
    return ret;
}

var Query = /** @class */ (function () {
    function Query(config, group) {
        this._group = group;
        if (isUndefined(Query._raw[this._group])) {
            Query._raw[this._group] = {};
            Query._refs[this._group] = 1;
        }
        else {
            Query._refs[this._group]++;
        }
        this.set(config);
    }
    Query.prototype.set = function (config) {
        var _this = this;
        this._config = config;
        this._defaults = Object.assign({}, this._defaults || {}, Query.getDefaults(config));
        var group = this._group;
        var fromQS = Query.fromQS(group);
        entries(config).forEach(function (_a) {
            var name = _a[0], _b = _a[1], paramConfig = _b === void 0 ? {} : _b;
            _this[name] = Query._raw[group][name];
            if (isUndefined(_this[name])) {
                var _default = _this._defaults[name];
                var coerce = paramConfig.coerce || (function (x) { return x; });
                var init = !isUndefined(fromQS[name]) ? fromQS[name] : paramConfig.initial;
                _this[name] = Query._raw[group][name] = Query.createQueryParam(group, name, _default, init, coerce);
            }
            else {
                _this[name].set(paramConfig);
            }
        });
        ko.tasks.runEarly();
    };
    Query.prototype.toJS = function () {
        return omit(ko.toJS(Query._raw[this._group]), isUndefined);
    };
    Query.prototype.toString = function () {
        return Query.stringify(this.toJS());
    };
    Query.prototype.asObservable = function () {
        var _this = this;
        if (!this._forceRecompute) {
            this._forceRecompute = ko.observable(false);
        }
        return ko.pureComputed(function () {
            _this._forceRecompute();
            return _this.toJS();
        });
    };
    Query.prototype.clear = function () {
        var _this = this;
        Object.keys(Query._raw[this._group]).forEach(function (k) { return Query._raw[_this._group][k].clear(); });
    };
    Query.prototype.dispose = function () {
        if (--Query._refs[this._group] === 0) {
            var current = Object.assign({}, Query.fromQS(), Query.getCleanQuery());
            delete current[this._group];
            Query.writeQueryString(current);
            delete Query._raw[this._group];
        }
    };
    Query.parse = function (str) {
        return Query._parser.parse(str);
    };
    Query.stringify = function (obj) {
        return Query._parser.stringify(obj);
    };
    Query.create = function (config, group) {
        return new Query(config, group);
    };
    Query.setParser = function (parser) {
        Query._parser = parser;
    };
    Query.getQueryString = function () {
        var matches = /\?([^#]*)/.exec(location.search + location.hash);
        return matches
            ? matches[1]
            : '';
    };
    Query.fromQS = function (group) {
        var query = this.parse(this.getQueryString());
        return (isUndefined(group) ? query : query[group]) || {};
    };
    Query.getCleanQuery = function () {
        var _query = {};
        for (var _i = 0, _a = entries(Query._raw); _i < _a.length; _i++) {
            var _b = _a[_i], g = _b[0], q = _b[1];
            _query[g] = ko.toJS(omit(q, function (v) {
                return v.isDefault() ||
                    isUndefined(v()) ||
                    (isEmpty(v()) && !isNumber(v()) && !isBool(v()));
            }));
        }
        if (_query[undefined]) {
            Object.assign(_query, _query[undefined]);
            delete _query[undefined];
        }
        return _query;
    };
    Query.writeQueryString = function (_query) {
        if (!_query) {
            _query = this.getCleanQuery();
        }
        var qs = Query.stringify(_query);
        var currentUrl = location.pathname + location.search + location.hash;
        var currentPathname = /([^?#]*)/.exec(currentUrl)[1];
        var hashMatches = /(#[^!]*)/.exec(currentUrl);
        var newUrl = currentPathname;
        if (qs) {
            newUrl += '?' + qs;
        }
        if (hashMatches) {
            newUrl += hashMatches[1];
        }
        history.replaceState(history.state, document.title, newUrl);
    };
    Query.queueQueryStringWrite = function () {
        var _this = this;
        if (!this._queuedUpdate) {
            this._queuedUpdate = new Promise(function (resolve) {
                ko.tasks.schedule(function () {
                    Query.writeQueryString();
                    resolve();
                    _this._queuedUpdate = false;
                });
            });
        }
        return this._queuedUpdate;
    };
    Query.createQueryParam = function (group, name, __default, // tslint:disable-line variable-name
        init, coerce) {
        var _this = this;
        var _default = ko.observable(ko.toJS(__default));
        var _p = ko.observable(isUndefined(init) ? _default() : init);
        var isDefault = ko.pureComputed(function () { return p() === _default(); });
        var p = ko.pureComputed({
            read: function () {
                return _p();
            },
            write: function (v) {
                if (isUndefined(v)) {
                    v = _default();
                }
                if (coerce) {
                    v = coerce(v);
                }
                _p(v);
                Query.queueQueryStringWrite()
                    .catch(function (err) { return console.error('[@profiscience/knockout-contrib-querystring] error queueing write'); });
            }
        });
        Object.assign(p, {
            isDefault: isDefault,
            set: function (d) {
                if (!_this.isParamConfigObject(d)) {
                    if (isDefault() || isUndefined(p())) {
                        p(d);
                    }
                    _default(d);
                }
                else {
                    if (d.coerce) {
                        coerce = d.coerce;
                    }
                    if (isDefault() || isUndefined(p()) || !isUndefined(d.initial)) {
                        p(isUndefined(d.initial) ? d.default : d.initial);
                    }
                    if (d.default) {
                        _default(d.default);
                    }
                }
            },
            clear: function () { return p(_default()); }
        });
        return p;
    };
    Query.isParamConfigObject = function (c) {
        return c && (c.default || c.initial || c.coerce);
    };
    Query.getDefaults = function (config) {
        var _this = this;
        var defaults = {};
        entries(config).forEach(function (_a) {
            var k = _a[0], v = _a[1];
            return (defaults[k] = _this.isParamConfigObject(v)
                ? v.default
                : v);
        });
        return defaults;
    };
    Query._raw = {};
    Query._refs = {};
    Query._parser = {
        parse: function (str) { return JSON.parse(decodeURIComponent(str || '{}')); },
        stringify: function (obj) { return JSON.stringify(obj) === '{}'
            ? ''
            : encodeURIComponent(JSON.stringify(obj)); }
    };
    return Query;
}());

return Query;

})));
