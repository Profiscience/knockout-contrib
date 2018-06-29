import {
  Context,
  IContext,
  IRouteConfig,
  RoutePlugin
} from '@profiscience/knockout-contrib-router'

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

export function createTitleRoutePlugin(
  compose = (ts: string[]) => ts.join(' | ')
): RoutePlugin {
  const titles: MaybePromise<string>[] = []

  return ({ title }: IRouteConfig) => {
    if (!title) return

    let async = false

    return (ctx: Context & IContext) => ({
      afterRender() {
        if (typeof title === 'function') {
          const t = title(ctx)
          if (t && typeof (t as any).then === 'function') {
            async = true
            ctx.queue(t as Promise<any>)
          }
          titles.push(t)
        } else {
          titles.push(title)
        }

        if (!ctx.$child) {
          if (async) {
            Promise.all(titles)
              .then((ts) => (document.title = compose(ts)))
              .catch((err) => {
                throw new Error(`Error setting title: ${err}`)
              })
          } else {
            document.title = compose(titles as string[])
          }
        }
      },
      beforeDispose() {
        titles.pop()
      }
    })
  }
}
