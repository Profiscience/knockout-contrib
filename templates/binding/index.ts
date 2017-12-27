{{#if namespaced }}
import 'knockout-punches'
{{/if}}
import * as ko from 'knockout'

declare global {
  // tslint:disable-next-line interface-name
  interface KnockoutBindingHandlers {
    {{ camelCase name }}: KnockoutBindingHandler
  }
}

const {{ camelCase name }}Binding{{#if namespaced }}{{else}}: KnockoutBindingHandler{{/if}} = {
  {{#if namespaced}}
  getNamespacedHandler(arg: string){{#if namespaced }}: KnockoutBindingHandler{{/if}} {
    return {
      init(el, valueAccessor, allBindings, viewModel, bindingContext) {
      },
      update(el, valueAccessor, allBindings, viewModel, bindingContext) {
      }
    }
  }
  {{else}}
  init(el, valueAccessor, allBindings, viewModel, bindingContext) {
  },
  update(el, valueAccessor, allBindings, viewModel, bindingContext) {
  }
  {{/if}}
}

ko.bindingHandlers.{{ camelCase name }} = {{ camelCase name }}Binding

// allow for aliasing or no-conflict usage
export default {{ camelCase name }}Binding
