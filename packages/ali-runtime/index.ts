import * as ko from 'knockout'
import 'knockout-punches'
import {
  Route,
  Router,
  childrenRoutePlugin,
  componentRoutePlugin,
  componentsRoutePlugin,
  redirectRoutePlugin,
  withRoutePlugin
} from '@profiscience/knockout-contrib'

const _ko = ko as any
const _window = window as any

export class App {
  private readonly config: AliConfig

  constructor(...keys: string[]) {
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

export { Route, Router }
