export type Primitive = string | boolean | number | null | undefined
export type MaybeArray<T> = T | T[]

export function isBool(x: any) {
  return typeof x === 'boolean'
}

export function isEmpty(x: any) {
  return x.length === 0
}

export function isNumber(x: any) {
  return !isNaN(parseFloat(x))
}

export function isUndefined(x: any) {
  return typeof x === 'undefined'
}

export function entries(obj: { [k: string]: any }) {
  return Object.keys(obj).map((k) => [k, obj[k]])
}

export function omit(
  obj: { [k: string]: any },
  fn: (x: any) => boolean | void
) {
  const ret = {} as { [k: string]: any }
  for (const [k, v] of entries(obj)) {
    if (!fn(v)) {
      ret[k] = v
    }
  }
  return ret
}
