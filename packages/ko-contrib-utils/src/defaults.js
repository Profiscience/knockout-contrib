import fromJS from './fromJS'

export default function(dest, defaults, mapArraysDeep) {
  for (const prop in defaults) {
    if (isUndefined(dest[prop])) {
      dest[prop] = fromJS(defaults[prop], defaults[prop] instanceof Array && mapArraysDeep)
    }
  }

  return dest
}

function isUndefined(foo) {
  return typeof foo === 'undefined'
}
