import ko from 'knockout'

import { Router } from '../'

ko.components.register('preserve-state', {
  template: '<router></router>',
  viewModel: class {
    constructor({ t, done }) {
      Router.useRoutes({
        '/foo': 'foo',
        '/bar': 'bar',
        '/baz': 'baz'
      })

      history.pushState({ foo: 'foo' }, null, '/foo')

      ko.components.register('foo', {
        viewModel: class {
          constructor(ctx) {
            t.deepEquals(
              history.state,
              { foo: 'foo' },
              'initializes with correct history.state regardless'
            )

            history.replaceState({ bar: 'bar' }, document.title)

            Router.setConfig({
              preserveHistoryStateOnNavigation: true
            })

            ctx.router.update('/bar')
          }
        }
      })

      ko.components.register('bar', {
        viewModel: class {
          constructor(ctx) {
            t.deepEquals(history.state, { bar: 'bar' }, 'works as described')

            history.replaceState({ baz: 'notbaz' }, document.title)

            Router.update('/baz', { state: { baz: 'baz' } })
          }
        }
      })

      ko.components.register('baz', {
        viewModel: class {
          constructor(ctx) {
            t.deepEquals(
              history.state,
              { baz: 'baz' },
              'uses explicit state instead if specified'
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
