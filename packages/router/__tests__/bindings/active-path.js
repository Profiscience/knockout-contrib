import ko from 'knockout'
import $ from 'jquery'

import { Router } from '../../'

ko.components.register('bindings-active-path', {
  template: `
    <a id="custom-class" data-bind="activePath: '/a/b', pathActiveClass: 'custom-active-class'"></a>
    <a id="outer-absolute" data-bind="activePath: '//a/b'"></a>
    <a id="outer-absolute-partial" data-bind="activePath: '//a/*'"></a>
    <a id="outer" data-bind="activePath: '/a/b'"></a>
    <a id="outer-partial" data-bind="activePath: '/a/*'"></a>
    <router></router>
  `,
  viewModel: class BindingTest {
    constructor({ t, done }) {
      history.replaceState(null, null, '/a/b')

      Router.useRoutes({
        '/a': [
          'a',
          {
            '/b': 'b'
          }
        ]
      })

      ko.components.register('a', {
        synchronous: true,
        viewModel: class {
          constructor(ctx) {
            ctx.$child.router.initialized.then(() => {
              t.ok(
                $('#custom-class').hasClass('custom-active-class'),
                'should apply custom active class when used with pathActiveClass binding'
              )

              t.ok(
                $('#outer-absolute').hasClass('active-path'),
                'should apply active class on elements outside routers with absolute path'
              )
              t.ok(
                $('#outer-absolute-partial').hasClass('active-path'),
                'should apply active class on elements outsite routers with partial absolute path'
              )
              t.ok(
                $('#outer').hasClass('active-path'),
                'should apply active class on elements outsite routers with local path'
              )
              t.ok(
                $('#outer-partial').hasClass('active-path'),
                'should apply active class on elements outsite routers with partial local path'
              )

              t.ok(
                $('#inner-local').hasClass('active-path'),
                'should apply active class on local path'
              )
              t.ok(
                $('#inner-local-partial').hasClass('active-path'),
                'should apply active class on partial local path'
              )
              t.ok(
                $('#inner-relative').hasClass('active-path'),
                'should apply active class on relative path'
              )
              t.ok(
                $('#inner-absolute').hasClass('active-path'),
                'should apply active class on absolute path'
              )
              t.ok(
                $('#inner-absolute-partial').hasClass('active-path'),
                'should apply active class on partial absolute path'
              )

              t.ok(
                $('#nested-relative').hasClass('active-path'),
                'should apply active class on local path in nested route'
              )
              t.ok(
                $('#nested-relative-up').hasClass('active-path'),
                'should apply active class on relative path to parent'
              )
              t.ok(
                $('#nested-relative-up-partial').hasClass('active-path'),
                'should apply active class on partial relative path to parent'
              )
              t.ok(
                $('#nested-absolute').hasClass('active-path'),
                'should apply active class on nested absolute path'
              )
              t.ok(
                $('#nested-absolute-partial').hasClass('active-path'),
                'should apply active class on partial nested absolute path'
              )

              done()
            })
          }
        },
        template: `
          <a id="inner-local" data-bind="activePath: '/a/b'"></a>
          <a id="inner-local-partial" data-bind="activePath: '/a/*'"></a>
          <a id="inner-relative" data-bind="activePath: './b'"></a>
          <a id="inner-absolute" data-bind="activePath: '//a/b'"></a>
          <a id="inner-absolute-partial" data-bind="activePath: '//a/*'"></a>
          <router></router>
        `
      })

      ko.components.register('b', {
        synchronous: true,
        template: `
          <a id="nested-relative" data-bind="activePath: '/b'"></a>
          <a id="nested-relative-up" data-bind="activePath: '../a/b'"></a>
          <a id="nested-relative-up-partial" data-bind="activePath: '../a/*'"></a>
          <a id="nested-absolute" data-bind="activePath: '//a/b'"></a>
          <a id="nested-absolute-partial" data-bind="activePath: '//a/*'"></a>
        `
      })
    }
  }
})
