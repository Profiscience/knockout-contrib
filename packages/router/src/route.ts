import isUndefined from 'lodash/isUndefined'
import castArray from 'lodash/castArray'
import flatten from 'lodash/flatten'
// this prevents `import pathToRegexp from 'path-to-regexp' from ending up in the
// declaration files so consumers don't need `allowSyntheticDefaultImports`
import pathToRegexp from 'path-to-regexp'
import { Key } from 'path-to-regexp'
import { IRouteConfig } from './'
import { Middleware } from './router'
import { MaybeArray } from './utils'

export type RouteMap = {
  [path: string]: MaybeArray<IRouteConfig | string | Middleware | RouteMap>
}

export type RoutePlugin = (routeConfig: IRouteConfig) => MaybeArray<RouteConfig>

export type RouteConfig =
  | MaybeArray<IRouteConfig> // custom route config, used w/ plugins
  | MaybeArray<string>       // component name
  | MaybeArray<Middleware>   // middleware
  | MaybeArray<Route>        // children
  /**
   * This makes for really fragile type-safety, so don't expose it in the API
   */
  // | MaybeArray<RouteMap>     // children, object shorthand

type NormalizedRouteConfig = {
  component?: string
  middleware?: Middleware[]
  children?: Route[]
}

export class Route {
  private static plugins: RoutePlugin[] = []

  public component: string
  public middleware: Middleware[]
  public children: Route[]
  public keys: Key[]

  private regexp: RegExp

  constructor(public path: string, ...config: RouteConfig[]) {
    Object.assign(this, Route.parseConfig(config))
    Object.assign(this, Route.parsePath(path, this.children.length > 0))
    if (this.children.length > 0 && !this.component) {
      this.component = 'router'
    }
  }

  public matches(path: string) {
    const matches = this.regexp.exec(path)
    if (matches === null) {
      return false
    }
    if (this.children.length === 0) {
      return true
    }
    for (const childRoute of this.children) {
      const childPath = '/' + (matches[matches.length - 1] || '')
      if (childRoute.matches(childPath)) {
        return true
      }
    }
    return false
  }

  public parse(path: string): { params: { [k: string]: any }, pathname: string, childPath: string } {
    let childPath
    let pathname = path
    const params: { [k: string]: any } = {}
    const matches = this.regexp.exec(path)

    for (let i = 1, len = matches.length; i < len; ++i) {
      const k = this.keys[i - 1]
      const v = matches[i] || ''
      if (k.name === '__child_path__') {
        childPath = '/' + v
        pathname = path.replace(new RegExp(childPath + '$'), '')
      } else {
        params[k.name] = v
      }
    }

    return { params, pathname, childPath }
  }

  public static usePlugin(...fns: RoutePlugin[]): typeof Route {
    this.plugins.push(...fns)
    return this
  }

  private static parseConfig(config: RouteConfig[]): NormalizedRouteConfig {
    const transformedConfig = this.runPlugins(config)
    const children: Route[] = []
    const middleware: Middleware[] = []
    let component: string

    for (const configEntry of transformedConfig) {
      if (typeof configEntry === 'string') {
        component = configEntry
      } else if (typeof configEntry === 'function') {
        middleware.push(configEntry)
      } else if (configEntry instanceof Route) {
        children.push(configEntry)
      } else {
        children.push(...
          Object.keys((configEntry as { [k: string]: RouteConfig[] }))
            .map((childPath) => new Route(childPath, ...castArray(configEntry[childPath])))
        )
      }
    }

    return { component, middleware, children }
  }

  private static runPlugins(config: RouteConfig[]): (string | Middleware | { [k: string]: RouteConfig[] })[] {
    return config.reduce<(string | Middleware | { [k: string]: RouteConfig[] })[]>((routeStack, configEntry) => {
      const configViaPlugins = Route.plugins.reduce((allPluginsStack, plugin) => {
        const pluginStack = plugin(configEntry)
        return isUndefined(pluginStack)
          ? allPluginsStack
          : [...allPluginsStack, ...flatten(castArray(pluginStack))]
      }, [])
      return [
        ...routeStack,
        ...(
          configViaPlugins.length > 0
            ? configViaPlugins
            : flatten(castArray(configEntry as any))
        )
      ]
    }, [])
  }

  private static parsePath(path: string, hasChildren: boolean) {
    if (hasChildren) {
      path = path.replace(/\/?!?$/, '/!')
    }

    if (path[path.length - 1] === '!') {
      path = path.replace('!', ':__child_path__(.*)?')
    } else {
      path = path.replace(/\(?\*\)?/, '(.*)')
    }

    const keys: Key[] = []
    const regexp = pathToRegexp(path, keys)

    return { keys, regexp }
  }
}
