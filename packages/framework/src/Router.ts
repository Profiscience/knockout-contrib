import isFunction from 'lodash/isFunction'
import { Router, IRouteConfig, Plugin, NormalizedRouteMap } from '@profiscience/knockout-contrib-router'
import { childrenPlugin } from './router-plugins/childrenPlugin'
import { titlePlugin } from './router-plugins/titlePlugin'
import { withPlugin } from './router-plugins/withPlugin'

export { Router, Plugin, IRouteConfig, NormalizedRouteMap }

export class Route {
  public state?: string
  public title?: string | (() => string | Promise<string>)
  public component?(): { template: Promise<{ default: string }>, viewModel?: Promise<{ default: any }> }
  public children?: { [k: string]: Route }
  public with?: { [k: string]: any }

  constructor(r: Route) { Object.assign(this, r) }
}

Router
  // .usePlugin(statePlugin)
  .usePlugin(titlePlugin)
  // .usePlugin(componentPlugin)
  .usePlugin(childrenPlugin)
  .usePlugin(withPlugin)
