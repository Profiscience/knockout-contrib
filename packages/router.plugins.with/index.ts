import {
  Context,
  IContext,
  IRouteConfig
} from '@profiscience/knockout-contrib-router'

type MaybePromise<T> = T | Promise<T>

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
    with?:
      | Context
      | IContext
      | ((ctx: Context & IContext) => MaybePromise<Context | IContext>)
  }
}

export function withRoutePlugin({ with: _with }: IRouteConfig) {
  if (!_with) return

  return async (ctx: Context & IContext) => {
    let src = _with
    if (typeof _with === 'function') {
      src = await _with(ctx)
    }
    Object.assign(ctx, src)
  }
}
