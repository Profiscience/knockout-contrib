import * as ko from 'knockout';
import fromJS from './fromJS';
export default function defaults(dest, defaults, mapArraysDeep) {
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
//# sourceMappingURL=defaults.js.map