import { Context, IContext, IRouteConfig, Middleware } from '@profiscience/knockout-contrib-router'

declare module '@profiscience/knockout-contrib-router' {
  // tslint:disable-next-line no-shadowed-variable
  interface IRouteConfig {
    {{camelCase name}}?: any // @TODO
  }
}

export function {{camelCase name}}Plugin({ {{camelCase name}} }: IRouteConfig): Middleware {
  return function*(ctx: Context & IContext): IterableIterator<void> {
    if (!{{camelCase name}}) return

    /* beforeRender */

    yield
    /* afterRender */

    yield
    /* beforeDispose */

    yield
    /* afterDispose */
  }
}
