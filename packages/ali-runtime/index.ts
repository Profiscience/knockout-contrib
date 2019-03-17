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

    if (keys.length === 0) {
      keys.push('Default')
    }
    this.configs = keys.map((k) => {
      const v = _window[Symbol.for(`ALI_CONFIG:${k}`)]
      if (!v) {
        throw new Error(`[ali] Configuration for "${k}" not found! Did you forget to install/configure @ali/build?`)
      }
      return v
    })

    this.configs.forEach((c) => {
      if (!c.strict) {
        c.bindings.forEach((b) => b.)
      }
    })
  }

  public start() {
    if (!document.body) document.append(document.createElement('body'))
    
    ko.applyBindings({}, document.body)
  }
}




export { Route, Router }