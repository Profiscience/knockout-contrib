// this prevents `import pathToRegexp from 'path-to-regexp' from ending up in the
// declaration files so consumers don't need `allowSyntheticDefaultImports`
import pathToRegexp from 'path-to-regexp'
import { Key } from 'path-to-regexp'
import { IRouteConfig } from './'
import { Middleware } from './router'
import { MaybeArray, castArray, flatten } from './utils'

export type RouteMap = {
  [path: string]: MaybeArray<IRouteConfig | string | Middleware | RouteMap>
}

export type RoutePlugin = (
  routeConfig: IRouteConfig
) => MaybeArray<NativeRouteConfig> | void

export type RouteConfig =
  | MaybeArray<IRouteConfig> // custom route config, used w/ plugins
  | MaybeArray<string> // component name
  | MaybeArray<Middleware> // middleware
  | MaybeArray<Route> // children
/**
 * This makes for really fragile type-safety, so don't expose it in the API
 */
// | MaybeArray<RouteMap>     // children, object shorthand

export type NativeRouteConfig = string | Middleware | Route

type NormalizedRouteConfig = {
  component?: string
  middleware?: Middleware[]
  children?: Route[]
}

export class Route {
  private static readonly plugins: RoutePlugin[] = []

  public component!: string
  public middleware!: Middleware[]
  public children!: Route[]
  public readonly keys!: Key[]

  private readonly regexp!: RegExp

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

  public parse(
    path: string
  ): { params: { [k: string]: any }; pathname: string; childPath?: string } {
    let childPath: string | undefined
    let pathname = path
    const params: { [k: string]: any } = {}
    const matches = this.regexp.exec(path)

    if (!matches) {
      throw new Error(
        `[@profiscience/knockout-contrib-router] Failed to parse "${path}" with route "${
          this.path
        }"`
      )
    }

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
    let component: undefined | string

    for (const configEntry of transformedConfig) {
      if (typeof configEntry === 'string') {
        component = configEntry
      } else if (typeof configEntry === 'function') {
        middleware.push(configEntry)
      } else if (configEntry instanceof Route) {
        children.push(configEntry)
      } else {
        // (probably one day) deprecated object syntax
        children.push(
          ...Object.keys(configEntry as { [k: string]: RouteConfig[] }).map(
            (childPath) =>
              new Route(
                childPath,
                ...castArray((configEntry as any)[childPath])
              )
          )
        )
      }
    }

    return { component, middleware, children }
  }

  private static runPlugins(rawConfig: RouteConfig[]): NativeRouteConfig[] {
    const getRouteConfigForArgViaPlugins = (arg: any) => (
      accum: NativeRouteConfig[],
      plugin: RoutePlugin
    ) => {
      const pluginStack = plugin(arg)
      return typeof pluginStack === 'undefined'
        ? // this plugin does not act on this route config, in may be bare middleware or a component id
          accum
        : // this plugin provided configuration with the given object, use it
          [...accum, ...flatten(castArray(pluginStack) as NativeRouteConfig[])]
    }
    // iterate through each argument passed to the route constructor, pass each to every plugin
    const accumulateAllRouteArgs = (
      accum: NativeRouteConfig[],
      arg: RouteConfig
    ) => {
      const configViaPlugins = Route.plugins.reduce(
        getRouteConfigForArgViaPlugins(arg),
        []
      )
      return [
        ...accum,
        ...(configViaPlugins.length > 0
          ? configViaPlugins
          : flatten(castArray(arg as MaybeArray<NativeRouteConfig>)))
      ]
    }
    return rawConfig.reduce(accumulateAllRouteArgs, [])
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
