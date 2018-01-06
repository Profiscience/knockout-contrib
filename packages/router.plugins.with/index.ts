import { Context, IContext, IRouteConfig } from '@profiscience/knockout-contrib-router'

declare module '@profiscience/knockout-contrib-router' {
  // tslint:disable-next-line no-shadowed-variable
  interface IRouteConfig {
    /**
     * Additional data to extend context with.
     *
     * Can be used for overriding url params, e.g.
     *
     * ```typescript
     *  with: { params: { id: 0 } }
     * ```
     */
    with?: Context | IContext
  }
}

export function withPlugin({ with: _with }: IRouteConfig) {
  return (ctx: Context & IContext) => {
    if (_with) Object.assign(ctx, _with)
  }
}
