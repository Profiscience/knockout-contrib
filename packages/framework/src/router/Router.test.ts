import 'jest'

import { Context, IContext, Middleware } from '@profiscience/knockout-contrib-router'
import { Router } from './Router'
import { Route } from './Route'

describe('statePlugin', () => {
  test('enables named state navigation', () => {
    Router.update = jest.fn()

    const routes = new Route('/', {
      state: 'top',
      children: [
        new Route('/one', {
          state: 'middle1',
          children: [
            new Route('/bottom', {
              state: 'bottom'
            })
          ]
        }),
        new Route('/two/:param', {
          state: 'middle2',
          children: [
            new Route('/bottom', {
              state: 'bottom'
            })
          ]
        })
      ]
    })

    // statePlugin(routes)

    // navigateToState('top')
    // expect(Router.update).toBeCalledWith('/')

    // navigateToState('top.middle1')
    // expect(Router.update).toBeCalledWith('/one')

    // navigateToState('top.middle2({ param: "foo" }).bottom')
    // expect(Router.update).toBeCalledWith('/two/foo/bottom')
  })
})
