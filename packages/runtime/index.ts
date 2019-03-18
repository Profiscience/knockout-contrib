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
import { ComponentLoader, IUseableStyle } from './component-loader'

const _ko = ko as any

export { ComponentLoader, IUseableStyle, Route, Router }

export class App {
  constructor() {
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
