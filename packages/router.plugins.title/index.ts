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

    return (ctx: Context & IContext) => ({
      afterRender() {
        titles.push(typeof title === 'function' ? title(ctx) : title)

        if (!ctx.$child) {
          ctx.queue(
            Promise.all(titles)
              .then((ts) => {
                document.title = compose(ts)
              })
              .catch((err) => {
                throw new Error(`Error setting title: ${err}`)
              })
          )
        }
      },
      beforeDispose() {
        titles.pop()
      }
    })
  }
}
