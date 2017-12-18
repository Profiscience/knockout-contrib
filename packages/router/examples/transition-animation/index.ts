import * as $ from 'jquery'
import * as ko from 'knockout'
import { Router } from '@profiscience/knockout-contrib-router'

Router.setConfig({ base: '/transition-animation', hashbang: true })

Router.use(function*(ctx: any): IterableIterator<Promise<void>> {
  // ctx.element does not exist before render, for obvious reasons.
  yield

  // For less obvious reasons, ctx.element is undefined during redirection,
  // so we need to add a guard otherwise the following promises will never
  // resolve.
  if (ctx.element) {
    const $el = $(ctx.element)

    yield new Promise((resolve) => $el.fadeIn(resolve))
    yield new Promise((resolve) => $el.fadeOut(resolve))
  }
})

// This is semantically the same, but uses an async generator (which yields a promise)
// instead of yielding a promise directly
//
// Router.use(async function*(ctx: any): AsyncIterableIterator<void> {
//   yield
//
//   if (ctx.element) {
//     const $el = $(ctx.element)
//
//     await new Promise((resolve) => $el.fadeIn(resolve))
//     yield
//
//     await new Promise((resolve) => $el.fadeOut(resolve))
//     yield
//   }
// })

Router.useRoutes({
  '/': (ctx: any) => ctx.redirect('/foo'),
  '/foo': 'foo',
  '/bar': 'bar'
})

ko.components.register('app', { template: '<router></router>' })
ko.components.register('foo', {
  template: `
    <h1>foo</h1>

    <hr>

    <a data-bind="path: '//bar'">go to bar</a>
  `
})
ko.components.register('bar', {
  template: `
    <h1>bar</h1>

    <hr>

    <a data-bind="path: '//'">go to foo</a>
  `
})

ko.applyBindings()
