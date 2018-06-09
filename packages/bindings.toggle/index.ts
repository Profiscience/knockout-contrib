import * as ko from 'knockout'

declare global {
  // tslint:disable-next-line interface-name
  interface KnockoutBindingHandlers {
    toggle: KnockoutBindingHandler
  }
}

export const toggleBindingHandler: KnockoutBindingHandler = {
  init(el, valueAccessor, allBindings, viewModel, bindingContext) {
    if (!ko.isWriteableObservable(valueAccessor())) {
      throw new Error('[@profiscience/knockout-contrib-bindings-toggle] Value is not a writable observable')
    }

    ko.applyBindingsToNode(el, {
      click() {
        if (!ko.unwrap(allBindings.get('toggleDisable'))) {
          valueAccessor()(!valueAccessor()())
        }
      }
    })
  }
}
