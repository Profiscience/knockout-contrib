import * as ko from 'knockout'
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'
import { TransformMixin } from '@profiscience/knockout-contrib-model-mixins-transform'

export function SpreadMixin(property: string) {
  return TransformMixin((res) => {
    Object.assign(res, res[property])
    delete res[property]
    return res
  })
}
