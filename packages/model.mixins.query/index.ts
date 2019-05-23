import {
  DataModelConstructorBuilder,
  nonenumerable
} from '@profiscience/knockout-contrib-model-builders-data'
import {
  Query,
  IQuery,
  IQueryConfig
} from '@profiscience/knockout-contrib-query'

export function QueryMixin<Q extends IQueryConfig>(opts: Q, group?: string) {
  return <
    P extends IQuery<Q>,
    T extends new (...args: any[]) => DataModelConstructorBuilder<P>
  >(
    ctor: T
  ) =>
    class extends ctor {
      public query!: Query & IQuery<Q>

      public async init() {
        if (!this.query) {
          const query = Query.create<Q>(opts, group)
          this.query = query
          nonenumerable(this, 'query')
          Object.assign(this.params, query)
        }
        return super.init()
      }
    }
}
