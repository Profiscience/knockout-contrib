import * as ko from 'knockout'
import { Router } from './router'
import { traversePath, log, noop } from './utils'

declare global {
  // tslint:disable-next-line interface-name
  interface KnockoutBindingContext {
    $router: Router
  }
}

ko.components.register('router', {
  synchronous: true,
  viewModel: { createViewModel },
  template:
    `<div data-bind="if: component">
      <div data-bind="let: { $router: $rawData }">
        <div class="router-view" data-bind="__router__"></div>
      </div>
    </div>`
})

ko.bindingHandlers.__router__ = {
  init(el, valueAccessor, allBindings, viewModel, bindingCtx) {
    const $router = bindingCtx.$router
    const bindingEvent: any = (ko as any).bindingEvent

    bindingEvent.subscribe(el, 'descendantsComplete', () => {
      if ($router.ctx.$parent) {
        $router.ctx.$parent.router.initialized
          .then(() => $router.init())
          .catch(noop)
      } else {
        $router.init()
      }
    })

    ko.applyBindingsToNode(el, {
      component: { name: $router.component, params: $router.ctx },
      css: $router.component
    })

    return { controlsDescendantBindings: true }
  }
}

function createViewModel(params: { [k: string]: any }) {
  let router = Router.head
  if (!router) {
    router = new Router(Router.getPathFromLocation(), undefined, params)
  } else {
    while (router.bound) {
      router = router.ctx.$child.router
    }
  }
  router.bound = true

  if (router.isRoot) {
    router.ctx.runBeforeRender()
      .then(() => {
        if (router.ctx._redirect) {
          router.ctx.runAfterRender()
            .then(() => {
              const { router: r, path: p } = traversePath(router, router.ctx._redirect)
              r.update(p, router.ctx._redirectArgs).catch((err) => log.error('Error redirecting', err))
            })
            .catch((err) => log.error('Error in afterRender middleware', err))
        } else {
          router.ctx.render()
          Router.onInit.forEach((resolve) => resolve(router))
        }
      })
      .catch((err) => log.error('Error in beforeRender middleware', err))
  } else if (router.ctx._redirect) {
    const { router: r, path: p } = traversePath(router, router.ctx._redirect)
    setTimeout(() => r.update(p, router.ctx._redirectArgs))
  }

  return router
}
