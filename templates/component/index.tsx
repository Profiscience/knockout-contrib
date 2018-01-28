import { h } from 'jsx-dom'
import * as ko from 'knockout'
import { ViewModelConstructorBuilder } from '@profiscience/knockout-contrib-model'
import * as styles from './index.css'

export interface I {{pascalCase name}}Params {
}

class {{pascalCase name}}ViewModel extends ViewModelConstructorBuilder {
  constructor(params: I{{pascalCase name}}Params) {
    super()
  }
}

const template = [
  <div>
  </div>
]

ko.components.register('contrib-{{kebabCase name}}', {
  viewModel: {{pascalCase name}}ViewModel,
  template
})
