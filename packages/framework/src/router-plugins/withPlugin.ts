import { Plugin, Route, IRouteConfig } from '../Router'

export const withPlugin: Plugin = (route: Route & IRouteConfig) => route.with
  ? (ctx) => Object.assign(ctx, route.with)
  : []
