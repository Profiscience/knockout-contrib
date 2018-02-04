import 'core-js/es7/symbol'

import * as ko from 'knockout'
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'

export type PaginationStrategy<T extends { [k: string]: any }> = (page: number) => T

/**
 * Adds `page` param for use with fetch, and `.getMore()` method and `.hasMore()` observable.
 *
 * Use for "Load More" buttons, or infinite scrolling.
 *
 * @param ctor Base DataModel Constructor
 */
export function PagerMixin<PaginationParams = { page: number }>(
  property: string,
  strategy: PaginationStrategy<PaginationParams> = ((page: number) => ({ page })) as PaginationStrategy<any>
) {
  return <
    P extends PaginationParams, T extends { new(...args: any[]): DataModelConstructorBuilder<P> }
  >(ctor: T) => class extends ctor {
    protected pager!: AsyncIterableIterator<void>

    public hasMore: KnockoutObservable<boolean>

    constructor(...args: any[]) {
      // add page to params, have to do it this way b/c of param enforcments for mixins by TypeScript
      Object.assign(args[0], strategy(1))
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
      Object.assign(this.params, strategy(1))
      this.pager = this.createPager()
      const p = super.update()
      return p.then(() => this.pager.next().then(() => { /* void */ }))
    }

    protected async * createPager(): AsyncIterableIterator<void> {
      let page = 2

      Object.assign(this.params, strategy(page))

      const tap = (fn: any) => (v: any) => {
        fn(v)
        return v
      }
      const updateHasMore = (d: any) => this.hasMore(d[property] && d[property].length > 0)

      let next = this.fetch().then(tap(updateHasMore))
      let data: any

      yield
      do {
        data = await next;
        (this as any)[property].push(...data[property])
        Object.assign(this.params, strategy(++page))
        next = this.fetch().then(tap(updateHasMore))
        yield
      } while (this.hasMore())
    }
  }
}
