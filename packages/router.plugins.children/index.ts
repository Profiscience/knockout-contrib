import { Route, IRouteConfig } from '@profiscience/knockout-contrib-router'

declare module '@profiscience/knockout-contrib-router' {
  // tslint:disable-next-line no-shadowed-variable
  interface IRouteConfig {
    /**
     * Nested routes, only allows explicit route constructor syntax routes
     */
    children?: Route[]
  }
}

export function childrenRoutePlugin({ children }: IRouteConfig) {
  return children || []
}
