import ko from 'knockout'

import { Router } from '../'

ko.components.register('before-navigate-callbacks', {
  template: '<router></router>',
  viewModel: class BeforeNavigateCallbackTest {
    constructor({ t, done }) {
      Router.useRoutes({
        '/': 'empty',
        '/sync': 'sync',
        '/async': 'async',
        '/nested': [
          'nested',
          {
            '/': 'nested-child'
          }
        ]
      })

      ko.components.register('empty', {})

      setTimeout(() => this.runTests(t).then(done))
    }

    async runTests(t) {
      let block

      history.replaceState(null, null, '/sync')

      ko.components.register('sync', {
        viewModel: class {
          constructor(ctx) {
            ctx.addBeforeNavigateCallback(() => !block)
          }
        }
      })

      ko.components.register('async', {
        viewModel: class {
          constructor(ctx) {
            ctx.addBeforeNavigateCallback(() => Promise.resolve(!block))
          }
        }
      })

      let hit = false

      ko.components.register('nested', {
        template: '<router></router>',
        viewModel: class {
          constructor(ctx) {
            ctx.addBeforeNavigateCallback(() => {
              t.ok(hit, 'callbacks are called sequentially from bottom => top')
            })
          }
        }
      })

      ko.components.register('nested-child', {
        viewModel: class {
          constructor(ctx) {
            ctx.addBeforeNavigateCallback(
              () =>
                new Promise((resolve) => {
                  setTimeout(() => {
                    hit = true
                    resolve()
                  }, 200)
                })
            )
          }
        }
      })

      await Router.update('/sync')
      block = true
      t.notOk(
        await Router.update('/'),
        'returning false should prevent navigation'
      )
      block = false
      t.ok(
        await Router.update('/'),
        'returning !false should not prevent navigation'
      )

      await Router.update('/async')
      block = true
      t.notOk(
        await Router.update('/'),
        'returning a promise that resolves false should prevent navigation'
      )
      block = false
      t.ok(
        await Router.update('/'),
        'returning a promise that resolves !false should prvent navigation'
      )

      await Router.update('/nested')
      await Router.update('/')
    }
  }
})
