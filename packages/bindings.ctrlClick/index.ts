import * as ko from 'knockout'

declare global {
  // tslint:disable-next-line interface-name
  interface KnockoutBindingHandlers {
    ctrlClick: KnockoutBindingHandler
    ctrlClickAllowMeta: KnockoutBindingHandler
  }
}

const ctrlClickBinding: KnockoutBindingHandler = {
  init(el, valueAccessor, allBindings, viewModel, bindingContext) {
    const allowMeta = allBindings.get('ctrlClickAllowMeta') !== false
    ko.applyBindingsToNode(el, {
      click($data, e) {
        if (e.ctrlKey || (allowMeta && e.metaKey)) {
          valueAccessor()($data, e)
        }
      }
    })
  }
}

export default ctrlClickBinding
