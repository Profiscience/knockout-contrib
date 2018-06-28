import * as ko from 'knockout'

export const altClickBindingHandler: KnockoutBindingHandler = {
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
