import ko from 'knockout'
import { Route, Router } from '../..'

ko.components.register('ambiguous', {
  template: '<router></router>',
  viewModel: class AmbiguousRoutingTest {
    constructor({ t, done }) {
      ko.components.register('wrong', {
        viewModel: class {
          constructor() {
            t.fail('fails on ambiguous routes')
            done()
          }
        }
      })

      ko.components.register('right-1', {
        viewModel: class {
          constructor() {
            t.pass('handles navigating to ambiguous route from unique parent')
            Router.update('//ambiguous/a/b/c/d')
          }
        }
      })

      ko.components.register('right-2', {
        viewModel: class {
          constructor() {
            /**
             * This ensures that the router doesn't incorrectly assume we are on the same page
             * just because paths match.
             *
             * View the commit this comment was added for context.
             */
            t.pass(
              'handles navigating to ambiguous route from matching (but wrong) parent'
            )
            done()
          }
        }
      })
    }
  }
})

export const path = '/ambiguous/a/b/c'

export const routes = [
  new Route('/ambiguous', 'ambiguous', [
    new Route('/a', [new Route('/b', 'wrong')]),
    new Route('/a', [new Route('/b', [new Route('/c', 'right-1')])]),
    new Route('/a', [
      new Route('/b', [new Route('/c', [new Route('/d', 'right-2')])])
    ])
  ])
]
