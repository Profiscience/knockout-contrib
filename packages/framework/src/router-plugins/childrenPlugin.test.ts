import 'jest'

import { Context, IContext, Middleware } from '@profiscience/knockout-contrib-router'
import { childrenPlugin } from './childrenPlugin'

describe('childrenPlugin', () => {
  test('sets the title after render', () => {
    const route = { children: { '/': [] } }
    const childRoutes = childrenPlugin(route)

    expect(childRoutes).toEqual(route.children)
  })

  test('doesn\'t blow up when no children', () => {
    const route = {}
    const childRoutes = childrenPlugin(route)

    expect(childRoutes).toEqual([])
  })
})
