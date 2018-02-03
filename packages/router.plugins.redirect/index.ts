import { Context, IContext, IRouteConfig, Middleware } from '@profiscience/knockout-contrib-router'

declare module '@profiscience/knockout-contrib-router' {
  // tslint:disable-next-line no-shadowed-variable
  interface IRouteConfig {
    redirect?: (ctx: Context & IContext) => string | void | Promise<string | void>
  }
}

export function redirectPlugin({ redirect }: IRouteConfig): Middleware {
  return async (ctx: Context & IContext) => {
    if (!redirect) return
    const redirectUrl = await redirect(ctx)
    if (redirectUrl) {
      ctx.redirect(redirectUrl)
    }
  }
}
