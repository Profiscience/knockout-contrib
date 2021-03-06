import isPlainObject from 'lodash/isPlainObject'
import merge from 'lodash/merge'
import ko from 'knockout'

import { Route, Router } from '../'

ko.components.register('plugins', {
  template: '<router></router>',
  viewModel: class PluginTest {
    constructor({ t, done }) {
      history.replaceState(null, null, '/component')

      Router.usePlugin(
        (route) => {
          if (route.component) {
            return route.component
          }
        },
        (route) => {
          if (route.data) {
            return isPlainObject(route.data)
              ? Object.entries(route.data).map(([k, v]) => (ctx) =>
                  v.then((_v) => merge(ctx, { data: { [k]: _v } }))
                )
              : (ctx) => route.data.then((v) => (ctx.data = v))
          }
        }
      )

      Router.useRoutes({
        '/component': {
          component: 'component',
        },
        // eslint-disable-next-line formatting/newline-object-in-array
        '/data': [
          'data',
          {
            data: Promise.resolve(true),
          },
        ],
        // eslint-disable-next-line formatting/newline-object-in-array
        '/data-multi': [
          'data-multi',
          {
            data: {
              true: Promise.resolve(true),
              false: Promise.resolve(false),
            },
          },
        ],
        '/composed': {
          component: 'composed',
          data: Promise.resolve(true),
        },
      })

      Router.useRoutes([
        new Route('/route-constructor', {
          component: 'route-constructor',
          data: Promise.resolve(true),
        }),
      ])

      ko.components.register('component', {
        viewModel: class {
          constructor() {
            t.pass('plugin works with returned string')
            Router.update('/data')
          }
        },
      })

      ko.components.register('data', {
        viewModel: class {
          constructor(ctx) {
            t.equals(
              true,
              ctx.data,
              'plugin works with returned middleware func'
            )
            Router.update('/data-multi')
          }
        },
      })

      ko.components.register('data-multi', {
        viewModel: class {
          constructor(ctx) {
            t.deepEquals(
              { true: true, false: false },
              ctx.data,
              'plugin works with returned array of middleware funcs'
            )
            Router.update('/composed')
          }
        },
      })

      ko.components.register('composed', {
        viewModel: class {
          constructor(ctx) {
            t.equals(true, ctx.data, 'plugins can be composed')
            Router.update('/route-constructor')
          }
        },
      })

      ko.components.register('route-constructor', {
        viewModel: class {
          constructor(ctx) {
            t.equals(true, ctx.data, 'plugins work with route constructor')
            done()
          }
        },
      })
    }

    dispose() {
      Route.plugins = []
    }
  },
})
