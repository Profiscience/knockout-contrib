import * as ko from 'knockout'
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'

export const IS_CACHED = Symbol('CACHED')

const CACHE: { [k: string]: { [k: string]: any } } = {}

export function InMemoryCacheMixin() {
  const CACHE_ID = Symbol('CACHE_ID')

  CACHE[CACHE_ID] = {}

  return <
    P, T extends { new(...args: any[]): DataModelConstructorBuilder<P> }
  >(ctor: T) => class extends ctor {
    protected [IS_CACHED]: boolean

    constructor(...args: any[]) {
      super(...args)

      if (!this[IS_CACHED]) throw new InvalidImplementationError()
    }

    public save(): Promise<void> {
      clearAllCaches()
      return super.save()
    }

    public delete(): Promise<void> {
      clearAllCaches()
      return super.delete()
    }

    protected fetch(...args: any[]) {
      this[IS_CACHED] = true
      const key = hashParams(ko.toJS(this.params))
      if (!CACHE[CACHE_ID][key]) {
        CACHE[CACHE_ID][key] = super.fetch(...args)
      }
      return CACHE[CACHE_ID][key]
    }
  }
}

export function clearAllCaches() {
  Object.getOwnPropertySymbols(CACHE).forEach((CACHE_ID) => CACHE[CACHE_ID] = {})
}

// good enough, until it isn't
const isNotJsonToken = (t: string) => {
  switch (t) {
    case '{':
    case '}':
    case '"':
    case ':':
      return false
    default:
      return true
  }
}
function hashParams(obj: { [k: string]: any } = {}) {
  return JSON.stringify(obj).split('').filter(isNotJsonToken).sort().join('')
}

// tslint:disable-next-line max-classes-per-file
class InvalidImplementationError extends Error {
  constructor() {
    const message = `

    ERROR in [@profiscience/knockout-contrib-model-mixins-cache]

    CacheMixin was applied before \`fetch\` implementation; this model WILL NOT be cached.

    \`fetch\` MUST be implemented by a mixin which MUST be placed BEFORE CacheMixin in the chain.

    See the documentation at // @TODO for caveats.
    `
    super(message)
  }
}
