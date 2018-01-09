import { Context, IContext, IRouteConfig } from '@profiscience/knockout-contrib-router'
import { FLASH_MESSAGE } from '@profiscience/knockout-contrib-router-middleware'

declare module '@profiscience/knockout-contrib-router' {
  // tslint:disable-next-line no-shadowed-variable
  interface IRouteConfig {
    /**
     * Route Authorization Configuration
     */
    authorize?: IAuthorization[] | AuthorizationPluginRouteConfig
  }
}

export interface IAuthorization {
  /**
   * Value to set the flash message (via router.middleware.flashMessage) on
   * unauthorized redirect.
   */
  notAuthorizedMessage: string
  /**
   * Function to check if the current user is authorized to access this view
   */
  isAuthorized(ctx: Context & IContext): boolean | Promise<boolean>
}

/**
 * Global authorization plugin configuration
 */
export type AuthorizationPluginConfig = {
  /**
   * If true, user can access everything
   */
  isAdmin?: boolean
  /**
   * Globally configured path to redirect to when not authorized. May be overridden
   * by a route's `authorize` configuration.
   */
  notAuthorizedRedirectPath?: string
}

export type AuthorizationPluginRouteConfig = {
  authorizations: IAuthorization[]
  notAuthorizedRedirectPath: string | ((ctx: Context & IContext) => string | Promise<string>)
}

/**
 * Create an authorization route plugin with the supplied global configuration
 */
export function createAuthorizationPlugin(authorizationConfig: AuthorizationPluginConfig = {}) {
  return (routeConfig: IRouteConfig) => (ctx: Context & IContext) => {
    if (authorizationConfig.isAdmin || !routeConfig.authorize) return

    const {
      requiredAuthorizations,
      getNotAuthorizedRedirectPath
    } = normalizeArgs(authorizationConfig, routeConfig)

    const authorizations = requiredAuthorizations.map(async (authorization) => {
      if (!await authorization.isAuthorized(ctx)) {
        const redirectPath = await getNotAuthorizedRedirectPath(ctx)
        ctx.redirect(redirectPath, {
          with: {
            [FLASH_MESSAGE]: authorization.notAuthorizedMessage
          }
        })
      }
    })

    ctx.queue(Promise.all(authorizations).then(() => { /* noop */}))
  }
}

function normalizeArgs(pluginConfig: AuthorizationPluginConfig, routeConfig: IRouteConfig): {
  requiredAuthorizations: IAuthorization[],
  getNotAuthorizedRedirectPath: (ctx: Context & IContext) => string | Promise<string>
} {
  if (Array.isArray(routeConfig.authorize)) {
    return {
      requiredAuthorizations: routeConfig.authorize,
      getNotAuthorizedRedirectPath: () => pluginConfig.notAuthorizedRedirectPath
    }
  }
  return {
    requiredAuthorizations: routeConfig.authorize.authorizations,
    getNotAuthorizedRedirectPath: typeof routeConfig.authorize.notAuthorizedRedirectPath === 'function'
      ? routeConfig.authorize.notAuthorizedRedirectPath
      : () => (routeConfig.authorize as any).notAuthorizedRedirectPath
  }
}
