import ko from 'knockout';
import fromJS from './fromJS';

export default function merge(dest, src, mapArraysDeep) {
  var props = Object.keys(src);

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = props[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var prop = _step.value;

      if (isUndefined(dest[prop])) {
        dest[prop] = fromJS(src[prop], src[prop] instanceof Array && mapArraysDeep);
      } else if (ko.isWritableObservable(dest[prop])) {
        dest[prop](src[prop] instanceof Array && mapArraysDeep ? fromJS(src[prop], true)() : src[prop]);
      } else if (isUndefined(src[prop])) {
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

function isUndefined(foo) {
  return typeof foo === 'undefined';
}