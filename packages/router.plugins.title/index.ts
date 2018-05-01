import { Context, IContext, IRouteConfig } from '@profiscience/knockout-contrib-router'

declare module '@profiscience/knockout-contrib-router' {
  // tslint:disable-next-line no-shadowed-variable
  interface IRouteConfig {
    /**
     * Document title for view, can be async or sync accessor function
     */
    title?: string | ((ctx: Context & IContext) => string)
  }
}

export function createTitlePlugin(compose = (ts: string[]) => ts.join(' | ')) {
  const titles: string[] = []

  return ({ title }: IRouteConfig) => {
    return function*(ctx: Context & IContext): IterableIterator<void> {
      yield
      /* afterRender */

      if (title) {
        titles.push(
          typeof title === 'function'
            ? title(ctx)
            : title
        )
      }

      if (!ctx.$child) document.title = compose(titles)

      yield
      /* beforeDispose */

      if (title) titles.pop()
    }
  }
}
