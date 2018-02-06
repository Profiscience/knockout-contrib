import { Route, Router } from '@profiscience/knockout-contrib-router'
import {
  flashMessageMiddleware
} from '@profiscience/knockout-contrib-router-middleware'
import {
  childrenPlugin,
  componentPlugin,
  initializerPlugin,
  redirectPlugin
} from '@profiscience/knockout-contrib-router-plugins'

import { KnockoutContribFrameworkConfig } from './index'

export async function initialize(config: KnockoutContribFrameworkConfig) {
  Router
    .setConfig(config)
    .use(
      flashMessageMiddleware
    )

  Route
    .usePlugin(
      redirectPlugin,
      componentPlugin,
      initializerPlugin,
      childrenPlugin
  )

  /**
   * Plugins MUST be registered before routes are instantiated. Because imports
   * are hoisted, this means that we need to use dynamic import().
   *
   * We can use webpack's "eager" module method to ensure that all of the routes
   * are included in the entry bundle. See: https://webpack.js.org/api/module-methods/
   */
  await registerRoutes()
}

async function registerRoutes() {
  // dist / knockout-contrib-framework / @profiscience / node_modules
  // @ts-ignore
  const MANIFEST = await import( /* webpackMode: "eager" */ '@profiscience/knockout-contrib-framework/build/VIEW_MANIFEST')
  Router.useRoutes(Object.keys(MANIFEST).map((k) => (MANIFEST as any)[k]))
}
