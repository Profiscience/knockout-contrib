import * as ko from 'knockout'
import { Context } from './context'
import { Router } from './router'
import { traversePath, log, noop } from './utils'

declare global {
  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface KnockoutBindingContext {
    $router: Router
  }
}

ko.components.register('router', {
  synchronous: true,
  viewModel: { createViewModel },
  template: `
    <div data-bind="if: component">
      <div class="router-view" data-bind="__router__"></div>
    </div>
  `
})

ko.bindingHandlers.__router__ = {
  init(el, valueAccessor, allBindings, viewModel, bindingCtx) {
    const $router = bindingCtx.$rawData
    const bindingEvent = ko.bindingEvent

    bindingEvent.subscribe(el, 'descendantsComplete', () => {
      if ($router.ctx.$parent) {
        $router.ctx.$parent.router.initialized
          .then(() => $router.init())
          .catch(noop)
      } else {
        $router.init()
      }
    })

    ko.applyBindingsToNode(
      el,
      {
        component: { name: $router.component, params: $router.ctx },
        css: $router.component
      },
      bindingCtx.extend({ $router })
    )

    return { controlsDescendantBindings: true }
  }
}

function createViewModel(params: Record<string, unknown>): Router {
  let router = Router.head
  if (!router) {
    router = new Router(Router.getPathFromLocation(), undefined, params)
  } else {
    while (router.bound) {
      router = (router.ctx.$child as Context).router
    }
  }
  router.bound = true

  if (router.isRoot) {
    router.ctx
      .runBeforeRender()
      .then(() => {
        const redirectPath = router.ctx._redirect
        const redirectArgs = router.ctx._redirectArgs
        if (redirectPath) {
          router.ctx
            .runAfterRender()
            .catch(catchRedirectAfterRenderMiddleware)
            .then(() => {
              const { router: r, path: p } = traversePath(router, redirectPath)
              r.update(p, redirectArgs).catch((err) =>
                log.error('Error redirecting', err)
              )
            })
        } else {
          router.ctx.render()
          Router.onInit.forEach((resolve) => resolve(router))
        }
      })
      .catch((err) => log.error('Error in beforeRender middleware', err))
  } else if (router.ctx._redirect) {
    const { router: r, path: p } = traversePath(router, router.ctx._redirect)
    router.ctx
      .runAfterRender()
      .catch(catchRedirectAfterRenderMiddleware)
      .then(() => {
        setTimeout(() => {
          r.update(p, router.ctx._redirectArgs)
        })
      })
  }

  return router
}

function catchRedirectAfterRenderMiddleware(err: Error): void {
  log.warn(
    'Error in afterRender middleware during redirection. This may be caused by attempting to use ctx.component (or a property thereof), or the DOM in the middleware. Because redirection occured, no component was actually rendered. You may wish to add a guard in your middleware to handle this case.'
  )
  log.error(err)
}
