import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'
import {
  Query,
  IQuery,
  IQueryConfig
} from '@profiscience/knockout-contrib-query'

export function QueryMixin<Q extends IQueryConfig>(opts: Q) {
  return <
    P extends IQuery<Q>,
    T extends { new (...args: any[]): DataModelConstructorBuilder<P> }
  >(
    ctor: T
  ) =>
    class extends ctor {
      public query: Query & IQuery<Q>

      constructor(...args: any[]) {
        const query = Query.create<Q>(opts)
        Object.assign(args[0], query)
        super(...args)

        this.query = query
      }
    }
}
