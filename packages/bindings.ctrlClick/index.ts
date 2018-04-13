import * as ko from 'knockout'

declare global {
  // tslint:disable-next-line interface-name
  interface KnockoutBindingHandlers {
    ctrlClick: KnockoutBindingHandler
  }
}

export const ctrlClickBindingHandler: KnockoutBindingHandler = {
  init(el, valueAccessor, allBindings, viewModel, bindingContext) {
    ko.applyBindingsToNode(el, {
      click($data: any, e: MouseEvent) {
        if (e.ctrlKey) valueAccessor().call(this, $data, e)
      }
    })
  }
}

ko.bindingHandlers.ctrlClick = ctrlClickBindingHandler
