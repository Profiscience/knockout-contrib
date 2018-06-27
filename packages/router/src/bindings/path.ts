import * as ko from 'knockout'
import { Router } from '../router'
import {
  resolveHref,
  traversePath,
  getRouterForBindingContext,
  log
} from '../utils'
import { activePathBinding } from './active-path'

export const pathBinding: ko.BindingHandler = {
  init(el, valueAccessor, allBindings, viewModel, bindingCtx) {
    ;(activePathBinding.init as any).call(
      this,
      el,
      valueAccessor,
      allBindings,
      viewModel,
      bindingCtx
    )

    const path = ko.unwrap(valueAccessor())

    Router.initialized
      .then(() => {
        const router = getRouterForBindingContext(bindingCtx)
        const route = ko.pureComputed(() => traversePath(router, path))
        ko.applyBindingsToNode(
          el,
          {
            attr: {
              href: ko.pureComputed(() => resolveHref(route()))
            }
          },
          bindingCtx
        )
      })
      .catch((err) => log.error('Error initializing path binding', err))
  }
}

ko.bindingHandlers.path = pathBinding
