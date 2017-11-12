import ko from 'knockout'
import extend from 'lodash/extend'
import map from 'lodash/map'

import { Router } from '../../dist'

import * as init from './init'
import * as basic from './basic'
import * as params from './params'
import * as nested from './nested'
import * as similar from './similar'
import * as ambiguous from './ambiguous'

const tests = [
  basic,
  params,
  nested,
  similar,
  ambiguous
]

const paths = map(tests, 'path')

ko.components.register('routing', {
  template: '<router params="t: t, done: done"></router>',
  viewModel: class RoutingTestSuite {
    constructor({ t, done }) {
      Router.useRoutes(init.routes)
      history.pushState(null, null, init.path)
      Router.useRoutes(extend({}, ...map(tests, 'routes')))

      let resolve
      new Promise((_resolve) => (resolve = _resolve))
        .then(() => {
          this.runTests(t).then(done)
        })

      this.t = t
      this.done = () => resolve()
    }

    async runTests(t) {
      for (const path of paths) {
        await new Promise((resolve) => {
          Router.update(path, { with: { t, done: resolve } })
        })
      }
    }
  }
})
