import * as ko from 'knockout'
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'

const ID_ACCESSOR = Symbol()

let id = 1

export function MemoizeMixin<
  P,
  T extends { new (...args: any[]): DataModelConstructorBuilder<P> }
>(ctor: T) {
  const instances = new Map()
  return class extends ctor {
    constructor(...args: any[]) {
      const params = args[0]
      const key = getKey(params)
      if (instances.has(key)) {
        return instances.get(key)
      } else {
        super(...args)
        instances.set(key, this)
      }
    }
  }
}

function getKey(params: { [k: string]: any }) {
  const props = Object.keys(params).sort()
  let key = ''
  for (const prop of props) {
    key += prop
    if (ko.isObservable(params[prop])) {
      if (!params[prop][ID_ACCESSOR]) {
        params[prop][ID_ACCESSOR] = id++
      }
      key += `:${params[prop][ID_ACCESSOR]}`
    } else {
      key += `:${params[prop]}`
    }
  }
  return key
}
