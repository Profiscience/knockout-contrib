import * as ko from 'knockout'

declare global {
  // tslint:disable-next-line interface-name
  interface KnockoutBindingHandlers {
    altClick: KnockoutBindingHandler
  }
}

export const altClickBindingHandler: KnockoutBindingHandler = {
  init(el, valueAccessor, allBindings, viewModel, bindingContext) {
    ko.applyBindingsToNode(el, {
      click($data, e: MouseEvent) {
        if (e.altKey) valueAccessor().call(this, $data, e)
      }
    })
  }
}

ko.bindingHandlers.altClick = altClickBindingHandler
