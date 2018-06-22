import ko from 'knockout'

import { Route, Router } from '../../'

ko.components.register('route-constructor', {
  template: '<router></router>',
  viewModel: class RouteConstructorTest {
    constructor(ctx) {
      const { t, done } = ctx

      ko.components.register('spread', {
        viewModel: class {
          constructor() {
            t.pass('Route constructor works with spread children')
            Router.update('/nested/arr')
          }
        }
      })

      ko.components.register('arr', {
        viewModel: class {
          constructor() {
            t.pass('Route constructor works with child routes in array')
            Router.update('/middleware')
          }
        }
      })

      ko.components.register('route-constructor-middleware', {
        viewModel: class {
          constructor(ctx) {
            t.true(
              ctx.spreadMiddlewareHit,
              'middleware spread in arguments is used'
            )
            t.true(ctx.arrMiddlewareHit, 'middleware in an array is flattened')
            done()
          }
        }
      })
    }
  }
})

export const path = '/nested/spread'

/**
 * You'd probably never format routes like this, and for good reason.
 * The intent is to be as flexible as possible and to prevent users from
 * encountering annoying bugs when all that is wrong is an array somewhere
 * needs to be flattened.
 */
export const routes = [
  new Route('/', 'route-constructor', [
    new Route('/nested', new Route('/spread', 'spread'), [
      new Route('/arr', 'arr')
    ]),
    new Route(
      '/middleware',
      'route-constructor-middleware',
      (ctx) => {
        ctx.spreadMiddlewareHit = true
      },
      [
        (ctx) => {
          ctx.arrMiddlewareHit = true
        }
      ]
    )
  ])
]
