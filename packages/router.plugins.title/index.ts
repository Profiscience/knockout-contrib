import { Context, IContext, IRouteConfig } from '@profiscience/knockout-contrib-router'

type MaybePromise<T> = T | Promise<T>

declare module '@profiscience/knockout-contrib-router' {
  // tslint:disable-next-line no-shadowed-variable
  interface IRouteConfig {
    /**
     * Document title for view, can be async or sync accessor function
     */
    title?: string | ((ctx: Context & IContext) => MaybePromise<string>)
  }
}

export function createTitlePlugin(compose = (ts: string[]) => ts.join(' | ')) {
  const titles: MaybePromise<string>[] = []

  return ({ title }: IRouteConfig) => {
    return function*(ctx: Context & IContext): IterableIterator<void> {
      let async = false

      yield
      /* afterRender */

      if (title) {
        if (typeof title === 'function') {
          const t = title(ctx)
          if (t && typeof (t as Promise<string>).then === 'function') {
            async = true
            ctx.queue(t as Promise<any>)
          }
          titles.push(t)
        } else {
          titles.push(title)
        }
      }

      if (!ctx.$child) {
        if (async) {
          Promise.all(titles).then((ts) => document.title = compose(ts))
        } else {
          document.title = compose(titles as string[])
        }
      }

      yield
      /* beforeDispose */

      if (title) titles.pop()
    }
  }
}
