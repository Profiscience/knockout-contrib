import * as ko from 'knockout';
import fromJS from './fromJS';
export default function merge(dest, src, mapArraysDeep) {
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
//# sourceMappingURL=merge.js.map