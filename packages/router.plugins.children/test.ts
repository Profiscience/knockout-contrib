import * as ko from 'knockout'
import { Context, Route, IRouteConfig } from '@profiscience/knockout-contrib-router'

import { childrenPlugin } from './'

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
})
