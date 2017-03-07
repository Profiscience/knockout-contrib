import * as ko from 'knockout';
export default function fromJS(obj, mapArraysDeep, _parentIsArray) {
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
//# sourceMappingURL=fromJS.js.map