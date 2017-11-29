import { Plugin, Route, IRouteConfig, NormalizedRouteMap } from '../Router'

export const childrenPlugin: Plugin = (route: Route & IRouteConfig) => route.children as NormalizedRouteMap || []
