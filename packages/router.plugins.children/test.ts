import * as ko from 'knockout'
import { Context, IContext, Route, IRouteConfig } from '@profiscience/knockout-contrib-router'

import { childrenPlugin } from './index'

describe('router.plugins.children', () => {
  test('allows registering children with children property', () => {
    const children = [
      new Route('/a'),
      new Route('/b')
    ]
    const routeConfig: IRouteConfig = { children }
    const ret = childrenPlugin(routeConfig)

    expect(ret).toEqual(children)
  })

  test('works with object shorthand', () => {
    const children = {
      '/a': 'a',
      '/b': 'b'
    }
    const routeConfig: IRouteConfig = { children }
    const ret = childrenPlugin(routeConfig)

    expect(ret).toEqual(children)
  })

  test('doesn\'t blow up when not used', () => {
    const ctx = {} as Context & IContext
    const routeConfig: IRouteConfig = {}
    expect(() => childrenPlugin(routeConfig)).not.toThrow()
  })
})
