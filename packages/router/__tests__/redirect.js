import ko from 'knockout'

import { Router } from '../'

ko.components.register('redirect', {
  template: '<router></router>',
  viewModel: class RedirectTest {
    constructor({ t, done }) {
      const fooPre = {}
      const barPre = {}
      const bazPreChild = {}

      history.pushState(null, null, '/notfoo')

      Router.use(
        () => ({
          beforeRender() {
            fooPre.beforeRender = true
          },
          afterRender() {
            fooPre.afterRender = true
          },
          beforeDispose() {
            fooPre.beforeDispose = true
          },
          afterDispose() {
            fooPre.afterDispose = true
          },
        }),
        (ctx) => {
          if (ctx.pathname === '/notfoo') {
            ctx.redirect('/foo')
          }
        },
        (ctx) => ({
          beforeRender() {
            if (ctx.pathname === '/notfoo') {
              t.fail(
                'beforeRender middleware after redirect in global middleware should not be executed'
              )
            }
          },
          afterRender() {
            if (ctx.pathname === '/notfoo') {
              t.fail(
                'afterRender middleware after redirect in global middleware should not be executed'
              )
            }
          },
          beforeDispose() {
            if (ctx.pathname === '/notfoo') {
              t.fail(
                'beforeDispose middleware after redirect in global middleware should not be executed'
              )
            }
          },
          afterDispose() {
            if (ctx.pathname === '/notfoo') {
              t.fail(
                'afterDispose middleware after redirect in global middleware should not be executed'
              )
            }
          },
        })
      )

      Router.useRoutes({
        '/notfoo': 'notfoo',
        '/foo': 'foo',
        '/notbar': [
          'notbar',
          () => ({
            beforeRender() {
              barPre.beforeRender = true
            },
            afterRender() {
              barPre.afterRender = true
            },
            beforeDispose() {
              barPre.beforeDispose = true
            },
            afterDispose() {
              barPre.afterDispose = true
            },
          }),
          (ctx) => {
            ctx.redirect('/bar')
          },
          () => ({
            beforeRender() {
              t.fail(
                'beforeRender middleware after redirect in route middleware should not be executed'
              )
            },
            afterRender() {
              t.fail(
                'afterRender middleware after redirect in route middleware should not be executed'
              )
            },
            beforeDispose() {
              t.fail(
                'beforeDispose middleware after redirect in route middleware should not be executed'
              )
            },
            afterDispose() {
              t.fail(
                'afterDispose middleware after redirect in route middleware should not be executed'
              )
            },
          }),
        ],
        '/bar': 'bar',
        '/notbaz': [
          (ctx) => {
            ctx.queue(
              new Promise((resolve) =>
                setTimeout(() => {
                  ctx.redirect('/baz')
                  resolve()
                })
              )
            )
          },
          {
            '/': [
              'notbaz',
              () => ({
                beforeRender() {
                  bazPreChild.beforeRender = true
                },
                async afterRender() {
                  await new Promise((resolve) => {
                    setTimeout(() => {
                      bazPreChild.afterRender = true
                      resolve()
                    })
                  })
                },
                beforeDispose() {
                  bazPreChild.beforeDispose = true
                },
                afterDispose() {
                  bazPreChild.afterDispose = true
                },
              }),
            ],
          },
        ],
        '/baz': 'baz',
        '/qux': 'qux',
      })

      ko.components.register('notfoo', {
        viewModel: class {
          constructor() {
            t.fail('global redirect should not have intermediate render')
          }
        },
      })

      ko.components.register('notbar', {
        viewModel: class {
          constructor() {
            t.fail('route redirect should not have intermediate render')
          }
        },
      })

      ko.components.register('foo', {
        synchronous: true,
        viewModel: class {
          constructor() {
            t.true(
              fooPre.beforeRender,
              'pre global redirect beforeRender is ran'
            )
            t.true(fooPre.afterRender, 'pre global redirect afterRender is ran')
            t.true(
              fooPre.beforeDispose,
              'pre global redirect beforeDispose is ran'
            )
            t.true(
              fooPre.afterDispose,
              'pre global redirect afterDispose is ran'
            )

            Router.update('/notbar')
          }
        },
      })

      ko.components.register('bar', {
        synchronous: true,
        viewModel: class {
          constructor() {
            t.true(
              barPre.beforeRender,
              'pre route redirect beforeRender is ran'
            )
            t.true(barPre.afterRender, 'pre route redirect afterRender is ran')
            t.true(
              barPre.beforeDispose,
              'pre route redirect beforeDispose is ran'
            )
            t.true(
              barPre.afterDispose,
              'pre route redirect afterDispose is ran'
            )

            Router.update('/notbaz')
          }
        },
      })

      ko.components.register('baz', {
        synchronous: true,
        viewModel: class {
          constructor() {
            t.true(
              bazPreChild.beforeRender && bazPreChild.afterRender,
              'child afterRender middleware is handled correctly w/ late (queued promise) redirect in parent'
            )

            Router.update('/qux')
          }
        },
      })

      ko.components.register('qux', {
        synchronous: true,
        viewModel: class {
          constructor() {
            t.true(
              bazPreChild.beforeDispose && bazPreChild.afterDispose,
              'child disposal middleware is handled correctly w/ late (queued promise) redirect in parent'
            )

            done()
          }
        },
      })
    }
  },
})
