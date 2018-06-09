import * as ko from 'knockout'

declare global {
  // tslint:disable-next-line interface-name
  interface KnockoutBindingHandlers {
    shiftClick: KnockoutBindingHandler
  }
}

export const shiftClickBindingHandler: KnockoutBindingHandler = {
  init(el, valueAccessor, allBindings, viewModel, bindingContext) {
    ko.applyBindingsToNode(el, {
      click($data: any, e: MouseEvent) {
        if (e.shiftKey) valueAccessor().call(this, $data, e)
      }
    })
  }
}
