import * as ko from 'knockout'
import { fromJS } from '@profiscience/knockout-contrib-utils-from-js'

export type MergeOptions = {
  mapArrayElements?: boolean
  strict?: boolean
}

export function assign<
  TSrc extends Record<string, any>,
  TDest extends Record<string, any>
>(
  dest: TDest,
  src: TSrc,
  opts: MergeOptions = { mapArrayElements: false, strict: false }
): Record<keyof TDest | keyof TSrc, any> {
  const props = Object.keys(src) as (keyof TSrc)[]

  const ret = dest as Record<keyof TDest | keyof TSrc, any>

  for (const prop of props) {
    if (isUndefined(ret[prop])) {
      if (opts.strict) {
        ret[prop] = src[prop]
      } else {
        ret[prop] = fromJS(
          src[prop],
          (src[prop] as any) instanceof Array && opts.mapArrayElements
        )
      }
    } else if (ko.isObservable(ret[prop])) {
      // skip non-writable computeds
      if (!ko.isWriteableObservable(ret[prop])) {
        continue
      }
      ret[prop](
        (src[prop] as any) instanceof Array && opts.mapArrayElements
          ? ko.unwrap(fromJS(src[prop], true))
          : src[prop]
      )
    } else if (src[prop] && src[prop].constructor === Object) {
      // tslint:disable-next-line
      if (ret[prop] === null) {
        ret[prop] = {}
      }
      assign(ret[prop], src[prop], opts)
    } else {
      ret[prop] = src[prop]
    }
  }

  return ret
}

function isUndefined(foo: any): boolean {
  return typeof foo === 'undefined'
}
