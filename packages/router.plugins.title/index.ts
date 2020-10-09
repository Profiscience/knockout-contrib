import {
  Context,
  IContext,
  IRouteConfig,
  RoutePlugin,
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
  let terminalTitledRouteContext: null | (Context & IContext)

  return (routeConfig: IRouteConfig) => {
    const titleOrAccessor = routeConfig.title

    if (!titleOrAccessor) return

    return (ctx: Context & IContext) => ({
      beforeRender() {
        terminalTitledRouteContext = ctx
      },
      afterRender() {
        titles.push(
          typeof titleOrAccessor === 'function'
            ? titleOrAccessor(ctx)
            : titleOrAccessor
        )
        if (ctx === terminalTitledRouteContext) {
          terminalTitledRouteContext = null
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
      },
    })
  }
}
