import * as $ from 'jquery'
import * as ko from 'knockout'
import { Context, IContext, Middleware, Router } from '@profiscience/knockout-contrib-router'
import template from './index.html'

const transitionAnimationMiddleware: Middleware = function*(ctx: Context & IContext): IterableIterator<Promise<void>> {
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
}
// This is semantically the same, but uses an async generator (which yields a promise)
// instead of yielding a promise directly
//
// const transitionAnimationMiddleware = async function*(ctx: Context & IContext): AsyncIterableIterator<void> {
//   yield

//   if (ctx.element) {
//     const $el = $(ctx.element)

//     await new Promise((resolve) => $el.fadeIn(resolve))
//     yield

//     await new Promise((resolve) => $el.fadeOut(resolve))
//     yield
//   }
// }

Router.use(transitionAnimationMiddleware)

Router.useRoutes({
  '/': (ctx: any) => ctx.redirect('/foo'),
  '/foo': 'foo',
  '/bar': 'bar'
})

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

ko.components.register('transition-animation', { template })
