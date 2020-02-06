export type Primitive = string | boolean | number | null | undefined
export type MaybeArray<T> = T | T[]

export function isBool(x: unknown): x is boolean {
  return typeof x === 'boolean'
}

export function isEmpty(x: string | unknown[]): x is '' | [] {
  return x.length === 0
}

export function isNumber(x: unknown): x is number {
  return !isNaN(parseFloat(x as string))
}

export function isUndefined(x: unknown): x is undefined {
  return typeof x === 'undefined'
}

export function entries<T extends Record<string, T[keyof T]>>(
  obj: T
): [keyof T, T[keyof T]][] {
  return Object.keys(obj).map((k) => [k as keyof T, obj[k]])
}

export function omit<T extends Record<string, T[keyof T]>>(
  obj: T,
  fn: (x: T[keyof T]) => boolean | void
): Partial<T> {
  const ret: Partial<T> = {}
  for (const [k, v] of entries(obj)) {
    if (!fn(v)) {
      ret[k] = v
    }
  }
  return ret
}
