import 'core-js/es7/symbol'

import * as ko from 'knockout'
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'
import { INITIALIZED } from '@profiscience/knockout-contrib-router-plugins-init'

export type PaginationStrategy<T extends { [k: string]: any }> = (
  page: number
) => T

/**
 * Adds `page` param for use with fetch, and `.getMore()` method and `.hasMore()` observable.
 *
 * Use for "Load More" buttons, or infinite scrolling.
 *
 * @param ctor Base DataModel Constructor
 */

const PAGER = Symbol('PAGER')
const CREATE_PAGER = Symbol('CREATE_PAGER')
const PRIME_PAGER = Symbol('PRIME_PAGER')

export function PagerMixin<PaginationParams = { page: number }>(
  property: string,
  strategy: PaginationStrategy<PaginationParams> = ((page: number) => ({
    page
  })) as PaginationStrategy<any>
) {
  return <
    P extends PaginationParams,
    T extends { new (...args: any[]): DataModelConstructorBuilder<P> }
  >(
    ctor: T
  ) =>
    class extends ctor {
      protected [PAGER]!: AsyncIterableIterator<void>

      public hasMore: ko.Observable<boolean>

      constructor(...args: any[]) {
        // add page to params, have to do it this way b/c of param enforcments for mixins by TypeScript
        Object.assign(args[0], strategy(1))
        super(...args)

        this[PAGER] = this[CREATE_PAGER]()
        this.hasMore = ko.observable(true)

        // ensure method is called with correct "this" value
        this.getMore = this.getMore.bind(this)

        const initialized = this[INITIALIZED]
        this[INITIALIZED] = initialized
          // @TODO unchain this when proper error handling is implemented
          .then(() => this[PRIME_PAGER]())
      }

      public async getMore(): Promise<boolean> {
        this.loading(true)
        const { done } = await this[PAGER].next()
        this.loading(false)
        return !done
      }

      protected update() {
        Object.assign(this.params, strategy(1))
        this[PAGER] = this[CREATE_PAGER]()
        const p = super.update()
        return p.then(() => this[PRIME_PAGER]())
      }

      private async *[CREATE_PAGER](): AsyncIterableIterator<void> {
        let page = 2

        Object.assign(this.params, strategy(page))

        const tap = (fn: any) => (v: any) => {
          fn(v)
          return v
        }
        const updateHasMore = (d: any) =>
          this.hasMore(d[property] && d[property].length > 0)

        let next = this.fetch().then(tap(updateHasMore))
        let data: any

        yield
        do {
          data = await next
          ;(this as any)[property].push(...data[property])
          Object.assign(this.params, strategy(++page))
          next = this.fetch().then(tap(updateHasMore))
          yield
        } while (this.hasMore())
      }

      private async [PRIME_PAGER]() {
        await this[PAGER].next()
      }
    }
}
