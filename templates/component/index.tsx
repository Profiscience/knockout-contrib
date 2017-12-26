import { h } from 'jsx-dom'
import * as ko from 'knockout'
import { ViewModelConstructorBuilder } from '@profiscience/knockout-contrib-framework'

export interface I{{pascalCase name}}Params {
}

export class {{pascalCase name}}ViewModel extends ViewModelConstructorBuilder {
  constructor(params: I{{pascalCase name}}Params) {
    super()
  }
}

const template = [
  <div>
  </div>
]

const componentConfig = {
  viewModel: {{pascalCase name}}ViewModel,
  template
}

export default componentConfig

ko.components.register('contrib-{{kebabCase name}}', componentConfig)
