import * as ko from 'knockout'

declare global {
  // tslint:disable-next-line interface-name
  interface KnockoutBindingHandlers {
    ctrlClick: KnockoutBindingHandler
    ctrlClickAllowMeta: KnockoutBindingHandler
  }
}

export const shiftClickBinding: KnockoutBindingHandler = {
  init(el, valueAccessor, allBindings, viewModel, bindingContext) {
    ko.applyBindingsToNode(el, {
      click($data, e) {
        if (e.shiftKey) valueAccessor()($data, e)
      }
    })
  }
}

ko.bindingHandlers.ctrlClick = shiftClickBinding
