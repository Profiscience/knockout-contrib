import { Route, IRouteConfig } from '@profiscience/knockout-contrib-router'

import { childrenRoutePlugin } from './index'

Route.usePlugin(childrenRoutePlugin)

describe('router.plugins.children', () => {
  test('allows registering children with children property', () => {
    const children = [new Route('/a'), new Route('/b')]
    const route = new Route('/', { children })

    expect(route.children).toEqual(children)
  })

  test('works with object shorthand', () => {
    // this usage is discouraged with TypeScript, because adding it to the
    // type definition greatly weakens the type checking ability of the route
    // constructor syntax because this requires an index type. So, to use it
    // with TS, it must explicitly be the `any` type
    const children: any = {
      '/a': 'a',
      '/b': 'b'
    }
    const route = new Route('/', { children })

    expect(route.children).toHaveLength(2)
    expect(route.children[0].path).toBe('/a')
    expect(route.children[1].path).toBe('/b')
  })

  test("doesn't blow up when not used", () => {
    const routeConfig: IRouteConfig = {}
    expect(() => childrenRoutePlugin(routeConfig)).not.toThrow()
  })
})
