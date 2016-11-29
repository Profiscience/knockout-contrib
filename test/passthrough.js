import ko from 'knockout'

ko.components.register('passthrough', {
  template: '<ko-component-router params="routes: routes, foo: \'foo\'"></ko-component-router>',
  viewModel: class MiddlewareTest {
    constructor({ t, next }) {
      this.routes = {
        '/': 'foo'
      }

      ko.components.register('foo', {
        template: '<div></div>',
        viewModel(ctx) {
          t.equals('foo', ctx.foo, 'attaches additional params supplied via router to ctx')
          next()
        }
      })
    }

    dispose() {
      ko.components.unregister('passthrough')
      ko.components.unregister('foo')
    }
  }
})
