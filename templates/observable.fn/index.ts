import * as ko from 'knockout'

declare global {
  // tslint:disable-next-line interface-name
  interface KnockoutObservableFunctions<T> {
    {{camelCase name}}(): void
  }
}

ko.observable.fn.{{camelCase name}} = function(): void {
  const currentValue = this()
}