import fromJS from './fromJS';

export default function defaults(dest, defaults, mapArraysDeep) {
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