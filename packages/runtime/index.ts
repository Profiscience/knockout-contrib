import * as ko from 'knockout'
import 'knockout-punches'
import {
  Route,
  RoutePlugin,
  Router,
  Middleware,
  childrenRoutePlugin,
  componentRoutePlugin,
  componentsRoutePlugin,
  redirectRoutePlugin,
  withRoutePlugin
} from '@profiscience/knockout-contrib'
import { ComponentLoader } from './component-loader'

const _ko = ko as any

export { ComponentLoader, Route, Router }

export type AliAppConfig = {
  routing?: {
    base?: string
    hashbang?: boolean
    plugins?: RoutePlugin[]
    middleware?: Middleware[]
  }
}

export class App {
  constructor(config: AliAppConfig) {
    ko.options.deferUpdates = true

    _ko.punches.enableAll()

    Route.usePlugin(
      childrenRoutePlugin,
      componentRoutePlugin,
      componentsRoutePlugin,
      redirectRoutePlugin,
      withRoutePlugin
    )
  }

  public start() {
    if (!document.body) document.append(document.createElement('body'))

    ko.applyBindings({}, document.body)
  }
}
