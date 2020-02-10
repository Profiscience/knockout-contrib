import * as ko from 'knockout'

export const repeatBindingHandler: ko.BindingHandler = {
  init(el, valueAccessor, allBindings, viewModel, bindingContext) {
    const indexes = ko.pureComputed(() => {
      const arr = []
      const n = ko.unwrap(valueAccessor())
      for (let i = 0; i < n; i++) arr.push(i)
      return arr
    })
    ko.applyBindingsToNode(
      el,
      {
        foreach: indexes
      },
      bindingContext
    )
    return { controlsDescendantBindings: true }
  }
}
