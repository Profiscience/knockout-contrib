import * as ko from 'knockout'

declare global {
  // tslint:disable-next-line interface-name
  interface KnockoutBindingHandlers {
    metaClick: KnockoutBindingHandler
  }
}

export const metaClickBindingHandler: KnockoutBindingHandler = {
  init(el, valueAccessor, allBindings, viewModel, bindingContext) {
    ko.applyBindingsToNode(el, {
      click($data: any, e: MouseEvent) {
        if (e.metaKey) valueAccessor().call(this, $data, e)
      }
    })
  }
}

ko.bindingHandlers.metaClick = metaClickBindingHandler
