import 'knockout-punches'
import * as ko from 'knockout'
import $ from 'jquery'

declare module global {
  interface KnockoutBindingHandlers {
    jquery: KnockoutBindingHandler
  }
}

const jqueryBinding: KnockoutBindingHandler = {
  getNamespacedHandler(pluginName) {
    return {
      init(el, valueAccessor, allBindings) {
        const value = allBindings.get('value')
        const changeHandler = allBindings.get('event.change')
        let opts = valueAccessor()

        opts = opts || {}

        $(el)[pluginName](opts)

        // @todo: find where this is being used
        $(el).change((e) => {
          if (typeof value === 'function') {
            value($(el).val())
          }

          if (typeof changeHandler === 'function') {
            changeHandler(e)
          }
        })
      }
    }
  }
}

ko.bindingHandlers.jquery = jqueryBinding

// allow for aliasing or no-conflict usage
export default jqueryBinding