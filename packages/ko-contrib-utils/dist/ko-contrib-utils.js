this.ko = this.ko || {};
(function (exports,ko) {
'use strict';

ko = 'default' in ko ? ko['default'] : ko;

ko.observable.fn.decrement = ko.computed.fn.decrement = function (amt) {
  return decrement(this, amt);
};

function decrement(obs) {
  var amt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  if (!ko.isWritableObservable(obs)) {
    throw new Error('ko.computed.fn.decrement requires a writable computed');
  }
  return obs(obs() - amt);
}

ko.observable.fn.increment = ko.computed.fn.increment = function (amt) {
  return increment(this, amt);
};

function increment(obs) {
  var amt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

  if (!ko.isWritableObservable(obs)) {
    throw new Error('ko.computed.fn.increment requires a writable computed');
  }
  return obs(obs() + amt);
}

ko.observable.fn.subscribeOnce = ko.observableArray.fn.subscribeOnce = ko.computed.fn.subscribeOnce = function (fn) {
  return subscribeOnce(this, fn);
};

function subscribeOnce(obs, fn) {
  var killMe = obs.subscribe(function (v) {
    killMe.dispose();
    fn(v);
  });
  return killMe;
}

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
  return type + '(' + ko.toJSON(obs(), null) + ')';
}

function fromJS(obj, mapArraysDeep, _parentIsArray) {
  var obs = void 0;

  if (ko.isObservable(obj)) {
    obs = obj;
  } else if (obj instanceof Array) {
    obs = [];

    for (var i = 0; i < obj.length; i++) {
      obs[i] = fromJS(obj[i], mapArraysDeep, true);
    }

    obs = ko.observableArray(obs);
  } else if (obj instanceof Date || obj instanceof RegExp) {
    obs = ko.observable(obj);
  } else if (obj instanceof Function) {
    obs = obj;
  } else if (obj instanceof Object) {
    obs = {};

    for (var p in obj) {
      obs[p] = fromJS(obj[p]);
    }
  } else {
    obs = _parentIsArray && !mapArraysDeep ? obj : ko.observable(obj);
  }

  return obs;
}

function defaults(dest, defaults, mapArraysDeep) {
  for (var prop in defaults) {
    if (isUndefined(dest[prop])) {
      dest[prop] = fromJS(defaults[prop], defaults[prop] instanceof Array && mapArraysDeep);
    }
  }

  return dest;
}

function isUndefined(foo) {
  return typeof foo === 'undefined';
}

function merge(dest, src, mapArraysDeep) {
  var props = Object.keys(src);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = props[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var prop = _step.value;

      if (isUndefined$1(dest[prop])) {
        dest[prop] = fromJS(src[prop], src[prop] instanceof Array && mapArraysDeep);
      } else if (ko.isWritableObservable(dest[prop])) {
        dest[prop](src[prop] instanceof Array && mapArraysDeep ? fromJS(src[prop], true)() : src[prop]);
      } else if (isUndefined$1(src[prop])) {
        dest[prop] = undefined;
      } else if (src[prop].constructor === Object) {
        merge(dest[prop], src[prop], mapArraysDeep);
      } else {
        dest[prop] = src[prop];
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return dest;
}

function isUndefined$1(foo) {
  return typeof foo === 'undefined';
}

exports.decrement = decrement;
exports.increment = increment;
exports.subscribeOnce = subscribeOnce;
exports.toString = toString;
exports.defaults = defaults;
exports.fromJS = fromJS;
exports.merge = merge;

}((this.ko.utils = this.ko.utils || {}),ko));
