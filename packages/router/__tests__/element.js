import ko from 'knockout'

import { Router } from '../dist'

ko.components.register('element', {
  template: '<router></router>',
  viewModel: class Element {
    constructor({ t, done }) {
      const count = 0

      Router.useRoutes({
        '/': [
          (ctx) => ({
            beforeRender() {
              ctx.redirect('/foo')
            },
            afterRender() {
              t.equals(ctx.element, undefined, 'ctx.element is undefined in redirection')
            }
          })
        ],
        '/foo': [
          (ctx) => ({
            beforeRender() {
              t.equals(ctx.element, undefined, 'ctx.element is undefined before render')
            },
            afterRender() {
              const actual = document.getElementById('foo-view').parentElement
              debugger // eslint-disable-line
              t.equals(ctx.element, actual, 'ctx.element is router-view container after render')
              done()
            }
          }),
          'foo'
        ]
      })

      history.pushState(null, null, '/')

      ko.components.register('foo', { template: '<div id="foo-view"></div>' })
    }
  }
})
