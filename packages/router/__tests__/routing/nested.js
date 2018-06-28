import ko from 'knockout'

import { Router } from '../../'

function assertStaticIsNavigating(ctx) {
  return () => ({
    beforeRender() {
      ctx.t.equals(
        true,
        Router.isNavigating(),
        'Router.isNavigating() is true when nested routers are navigating'
      )
    },
    afterRender() {
      ctx.t.equals(
        false,
        Router.isNavigating(),
        'Router.isNavigating() is false when all nested routers finish'
      )
    }
  })
}

ko.components.register('nested', {
  template: '<router></router>',
  viewModel: class NestedRoutingTest {
    constructor(ctx) {
      const { t, done } = ctx

      t.pass('navigates to route with children')
      t.pass('uses specifed component with routes')
      t.equals(Router.head, Router.get(0), 'Router.head is top-most router')
      t.equals(ctx.router.depth, 0, 'ctx.router.depth is 0 for top-most router')

      const hLen = history.length

      ko.components.register('root', {
        viewModel: class {
          constructor(ctx) {
            t.equals(ctx.router.depth, 1, 'ctx.router.depth is correct')
            t.pass('initializes nested route')
            t.equals(
              hLen,
              history.length,
              'child route does not add history entry'
            )
            Router.update('/nested/a')
          }
        }
      })

      ko.components.register('a', {
        viewModel: class {
          constructor(ctx) {
            t.pass('navigates to new child route from parent router')
            ctx.router.update('/b')
          }
        }
      })

      ko.components.register('b', {
        viewModel: class {
          constructor() {
            t.pass('navigates to new child route from child router')
            Router.update('/nested/c')
          }
        }
      })

      let parent

      ko.components.register('c-pre', {
        template: '<router></router>',
        viewModel: class {
          constructor(ctx) {
            parent = ctx
          }
        }
      })

      ko.components.register('c', {
        viewModel: class {
          constructor(ctx) {
            t.equals(ctx.router.depth, 2, 'ctx.router.depth is correct')

            t.pass(
              'works with implied router component (no specified component)'
            )

            t.equals(
              ctx.$root.$child.router,
              Router.get(1),
              'Router.get(n) works'
            )

            t.equals(ctx.$root, Router.head.ctx, 'ctx.$root is Router.head.ctx')
            t.equals(
              Router.head.ctx.$parent,
              undefined,
              'root ctx.$parent is undefined'
            )

            t.equals(parent.$child, ctx, 'ctx.$child is child ctx')
            t.equals(ctx.$parent, parent, 'ctx.$parent is parent ctx')

            t.equals(
              ctx.$parents[0],
              parent,
              'ctx.$parents is array of parents, 0=$parent'
            )
            t.equals(
              ctx.$parents[1],
              parent.$parent,
              'ctx.$parents is array of parents, 1=$parent.$parent'
            )

            t.equals(
              parent.$children[0],
              ctx,
              'ctx.$children is array of child ctxs'
            )

            done()
          }
        }
      })
    }
  }
})

export const path = '/nested'

export const routes = {
  '/nested': [
    'nested',
    {
      '/': 'root',
      '/a': 'a',
      '/b': 'b',
      '/c': [
        assertStaticIsNavigating,
        'c-pre',
        {
          '/': 'c' // https://www.youtube.com/watch?v=5l-PjIqPOBw
        }
      ]
    }
  ]
}
