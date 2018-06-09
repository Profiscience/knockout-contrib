import 'knockout-punches'
import $ from 'jquery'

declare global {
  // tslint:disable-next-line interface-name
  interface KnockoutBindingHandlers {
    jquery: KnockoutBindingHandler
  }
}

export const jqueryBindingHandler: KnockoutBindingHandler = {
  getNamespacedHandler(pluginName: string) {
    return {
      init(el, valueAccessor, allBindings) {
        const $el: JQuery & { [k: string]: (opts: any) => any } = $(el) as any
        const value = allBindings.get('value')
        const changeHandler = allBindings.get('event.change') || (allBindings.get('event') || {}).change
        const opts = valueAccessor()

        $el.on('change', (e) => {
          if (value) value(el.value)
          if (changeHandler) changeHandler(e)
        })

        $el[pluginName](opts)

        if (value) value(el.value)
      }
    } as KnockoutBindingHandler
  }
}
