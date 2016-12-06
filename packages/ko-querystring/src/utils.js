
export function isUndefined(x) {
  return typeof x === 'undefined'
}

export function omit(obj, fn) {
  const ret = {}
  for (const [k, v] of Object.entries(obj)) {
    if (!fn(v)) {
      ret[k] = v
    }
  }
  return ret
}
