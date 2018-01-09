import { Context, IContext, IRouteConfig, Middleware } from '@profiscience/knockout-contrib-router'

declare module '@profiscience/knockout-contrib-router' {
  // tslint:disable-next-line no-shadowed-variable
  interface IRouteConfig {
    authorization?: any // @TODO
  }
}

export function authorizationPlugin({ authorization }: IRouteConfig): Middleware {
  return function*(ctx: Context & IContext): IterableIterator<void> {
    if (!authorization) return

    /* beforeRender */

    yield
    /* afterRender */

    yield
    /* beforeDispose */

    yield
    /* afterDispose */
  }
}
