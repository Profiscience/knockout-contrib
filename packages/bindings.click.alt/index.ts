import * as ko from 'knockout'

export const altClickBindingHandler: ko.BindingHandler = {
  init(el, valueAccessor, allBindings, viewModel, bindingContext) {
    ko.applyBindingsToNode(
      el,
      {
        click($data: any, e: MouseEvent) {
          if (e.altKey) valueAccessor().call(this, $data, e)
        }
      },
      bindingContext
    )
  }
}
