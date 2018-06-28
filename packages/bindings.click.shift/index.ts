import * as ko from 'knockout'

export const shiftClickBindingHandler: ko.BindingHandler = {
  init(el, valueAccessor, allBindings, viewModel, bindingContext) {
    ko.applyBindingsToNode(
      el,
      {
        click($data: any, e: MouseEvent) {
          if (e.shiftKey) valueAccessor().call(this, $data, e)
        }
      },
      bindingContext
    )
  }
}
