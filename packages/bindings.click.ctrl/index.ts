import * as ko from 'knockout'

export const ctrlClickBindingHandler: ko.BindingHandler = {
  init(el, valueAccessor, allBindings, viewModel, bindingContext) {
    ko.applyBindingsToNode(
      el,
      {
        click($data: any, e: MouseEvent) {
          if (e.ctrlKey) valueAccessor().call(this, $data, e)
        }
      },
      bindingContext
    )
  }
}
