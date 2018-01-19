import 'core-js/es7/symbol'

import * as ko from 'knockout'
import { DataModelConstructorBuilder, INITIALIZED } from '@profiscience/knockout-contrib-framework-model-builders-data'
import { fromJS } from '@profiscience/knockout-contrib-utils'
import '@profiscience/knockout-contrib-observable-fn'

/**
 * Adds `page` param for use with fetch, and `.getMore()` method and `.hasMore()` observable.
 *
 * Use for "Load More" buttons, or infinite scrolling.
 *
 * @param ctor Base DataModel Constructor
 */
export function CollectionMixin(property: string) {
  return <
    P extends { page: number }, T extends { new(...args: any[]): DataModelConstructorBuilder<P> }
  >(ctor: T) => class extends ctor {
    protected pager!: AsyncIterableIterator<void>

    public hasMore: KnockoutObservable<boolean>

    constructor(...args: any[]) {
      // add page to params, have to do it this way b/c of param enforcments for mixins by TypeScript
      args[0].page = 1
      super(...args)

      this.hasMore = ko.observable(true)
    }

    public async getMore(): Promise<boolean> {
      this.loading(true)
      const { done } = await this.pager.next()
      this.loading(false)
      return !done
    }

    protected update() {
      this.params.page = 1
      this.pager = this.createPager()
      const p = super.update()
      return p.then(() => this.pager.next().then(() => { /* void */ }))
    }

    protected async * createPager(): AsyncIterableIterator<void> {
      this.params.page = 2

      let next = this.fetch()
      let data: any

      yield

      do {
        data = await next
        this.hasMore(data[property] && data[property].length > 0)

        if (this.hasMore()) {
          (this as any)[property].push(...data[property].map((i: any) => fromJS(i)))
          this.params.page++
          next = this.fetch()
          yield
        }

      } while (this.hasMore())
    }
  }
}
