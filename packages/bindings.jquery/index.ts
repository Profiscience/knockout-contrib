import 'knockout-punches'
import $ from 'jquery'

export const jqueryBindingHandler = {
  getNamespacedHandler(pluginName: string) {
    return {
      init(el, valueAccessor, allBindings) {
        const $el: JQuery & { [k: string]: (opts: any) => any } = $(el) as any
        const value = allBindings.get('value')
        const changeHandler =
          allBindings.get('event.change') ||
          (allBindings.get('event') || {}).change
        const opts = valueAccessor()

        $el.on('change', (e) => {
          if (value) value(el.value)
          if (changeHandler) changeHandler(e)
        })

        $el[pluginName](opts)

        if (value) value(el.value)
      }
    } as ko.BindingHandler
  }
} as ko.BindingHandler
