import {
  Context,
  IContext,
  IRouteConfig,
  Middleware
} from '@profiscience/knockout-contrib-router'

declare module '@profiscience/knockout-contrib-router' {
  // tslint:disable-next-line no-shadowed-variable
  interface IRouteConfig {
    redirect?: (
      ctx: Context & IContext
    ) => string | void | Promise<string | void>
  }
}

export function redirectRoutePlugin({ redirect }: IRouteConfig): Middleware | void {
  if (!redirect) return

  return async (ctx: Context & IContext) => {
    const redirectUrl = await redirect(ctx)
    if (redirectUrl) {
      ctx.redirect(redirectUrl)
    }
  }
}
