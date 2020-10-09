/* [path-to-regexp](https://github.com/pillarjs/path-to-regexp) is well tested,
 * so there isn't too much room for error in this as long as the params are being
 * attached to context and the route is working
 **/

import ko from 'knockout'

ko.components.register('params', {
  viewModel: class ParamsTest {
    constructor(ctx) {
      const { t, done, params, search, hash } = ctx
      if (ctx.firstRun !== false) {
        t.equal('foo', params.foo, 'parses param to ctx.params')
        t.equals('?bar=bar', search, 'adds querystring to ctx.search')
        t.equals('#baz', hash, 'adds hash to ctx.hash')
        ctx.router.update('/params/bar', {
          with: { t, done, firstRun: false },
        })
      } else {
        t.equal(
          'bar',
          params.foo,
          're-initializes component if navigated to w/ different params'
        )
        done()
      }
    }
  },
})

export const path = '/params/foo?bar=bar#baz'

export const routes = {
  '/params/:foo': 'params',
}
