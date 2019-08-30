import { Route, IRouteConfig } from '@profiscience/knockout-contrib-router'

declare module '@profiscience/knockout-contrib-router' {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface IRouteConfig {
    /**
     * Nested routes, only allows explicit route constructor syntax routes
     */
    children?: Route[]
  }
}

export function childrenRoutePlugin({ children }: IRouteConfig): Route[] {
  return children || []
}
