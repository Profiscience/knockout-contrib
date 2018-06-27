import * as ko from 'knockout'
import { Router } from '../router'
import {
  isActivePath,
  traversePath,
  getRouterForBindingContext,
  log
} from '../utils'

export const activePathBinding: ko.BindingHandler = {
  init(el, valueAccessor, allBindings, viewModel, bindingCtx) {
    const activePathCSSClass =
      allBindings.get('pathActiveClass') || Router.config.activePathCSSClass
    const path = ko.unwrap(valueAccessor())

    Router.initialized
      .then(() => {
        const router = getRouterForBindingContext(bindingCtx)
        const route = ko.pureComputed(() => traversePath(router, path))
        ko.applyBindingsToNode(
          el,
          {
            css: {
              [activePathCSSClass]: ko.pureComputed(() => isActivePath(route()))
            }
          },
          bindingCtx
        )
      })
      .catch((err) => log.error('Error initializing activePath binding', err))
  }
}

ko.bindingHandlers.activePath = activePathBinding
