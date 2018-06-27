import * as ko from 'knockout'

export const metaClickBindingHandler: ko.BindingHandler = {
  init(el, valueAccessor, allBindings, viewModel, bindingContext) {
    ko.applyBindingsToNode(
      el,
      {
        click($data: any, e: MouseEvent) {
          if (e.metaKey) valueAccessor().call(this, $data, e)
        }
      },
      bindingContext
    )
  }
}
