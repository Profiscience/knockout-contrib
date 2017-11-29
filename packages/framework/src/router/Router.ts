/* tslint:disable max-classes-per-file */

/**
 * After thought, the plugin system provided by the router has the flaw of existing
 * globally, making incremental adoption difficult. To work around, we do essentially
 * the same thing here, but it will only affect routes using the constructor.
 *
 * Note also, this expects routes to be self-contained, carrying their path with them,
 * making the tree of routes nested arrays, and not objects. To interop with the Router's
 * expected { [path: string]: route } API, use ...Object.assign(...routes). This syntax
 * flattens all of the routes into an object, and then spreads the entries into an existing
 * object.
 *
 * e.g.
 *
 * {
 *   '/': {
 *     '/oldStyleChild': [...],
 *     ...Object.assign(...routes)
 *   }
 *
 *   // or if no legacy routes
 *  '/': Object.assign(...routes)
 * }
 */

import isFunction from 'lodash/isFunction'
import { Router, NormalizedRouteConfig } from '@profiscience/knockout-contrib-router'

const states = {}

export { Router }

// Router
  // .usePlugin(statePlugin)
  // .usePlugin(titlePlugin)
  // .usePlugin(componentPlugin)
  // .usePlugin(childrenPlugin)
  // .usePlugin(withPlugin)
