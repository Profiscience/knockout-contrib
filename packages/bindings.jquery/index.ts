import 'knockout-punches'
import $ from 'jquery'

declare global {
  // tslint:disable-next-line interface-name
  interface KnockoutBindingHandlers {
    jquery: KnockoutBindingHandler
  }
}

const jqueryBinding: KnockoutBindingHandler = {
  getNamespacedHandler(pluginName: string) {
    return {
      init(el, valueAccessor, allBindings) {
        const value = allBindings.get('value')
        const changeHandler = allBindings.get('event.change') || (allBindings.get('event') || {}).change
        let opts = valueAccessor()

        opts = opts || {}

        $(el).change((e) => {
          if (typeof value === 'function') {
            value($(el).val())
          }

          if (typeof changeHandler === 'function') {
            changeHandler(e)
          }
        })

        $(el)[pluginName](opts)

        if (typeof value === 'function') {
          value($(el).val())
        }
      }
    }
  }
}

export default jqueryBinding
