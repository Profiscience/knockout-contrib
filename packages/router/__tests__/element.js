import ko from 'knockout'

import { Router } from '../'

ko.components.register('element', {
  template: '<router></router>',
  viewModel: class Element {
    constructor({ t, done }) {
      Router.useRoutes({
        '/': [
          (ctx) => ({
            beforeRender() {
              ctx.redirect('/foo')
            },
            afterRender() {
              t.equals(
                ctx.element,
                undefined,
                'ctx.element is undefined in redirection'
              )
            }
          })
        ],
        '/foo': [
          (ctx) => ({
            beforeRender() {
              t.equals(
                ctx.element,
                undefined,
                'ctx.element is undefined before render'
              )
            },
            afterRender() {
              const actual = document.getElementById('foo-view').parentElement
              t.equals(
                ctx.element,
                actual,
                'ctx.element is router-view container after render'
              )
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
