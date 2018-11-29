import ko from 'knockout'

import { Router } from '../'

ko.components.register('preserve-query', {
  template: '<router></router>',
  viewModel: class ForceUpdate {
    constructor({ t, done }) {
      Router.setConfig({
        preserveQueryStringOnNavigation: true
      })

      Router.useRoutes({
        '/foo': 'foo',
        '/bar': 'bar',
        '/baz': 'baz'
      })

      history.pushState(null, null, '/foo?qux=qux')

      ko.components.register('foo', {
        viewModel: class {
          constructor(ctx) {
            ctx.router.update('/bar')
          }
        }
      })

      ko.components.register('bar', {
        viewModel: class {
          constructor(ctx) {
            t.equals(window.location.search, '?qux=qux', 'works as described')
            Router.update('/baz?qux=notqux')
          }
        }
      })

      ko.components.register('baz', {
        viewModel: class {
          constructor(ctx) {
            t.equals(
              window.location.search,
              '?qux=notqux',
              'uses explicit querystring instead if specified'
            )

            Router.setConfig({
              preserveQueryStringOnNavigation: false
            })

            done()
          }
        }
      })
    }
  }
})
