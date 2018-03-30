import * as ko from 'knockout'
import { ViewModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-view'
import { Router } from '@profiscience/knockout-contrib-router'

location.hash = '!/'

class ViewModel extends ViewModelConstructorBuilder {
  public examples = [
    'lazy-loading',
    'loading-animation',
    'path-binding',
    'simple-auth',
    'transition-animation'
  ]
  public selectedExample = ko.observable('')
  public exampleComponent = ko.observable('')

  constructor() {
    super()

    this.subscribe(this.selectedExample, async (v) => {
      await import(`./${v}`)
      this.exampleComponent(v)
    })
  }
}

Router.setConfig({
  base: '/router',
  hashbang: true
})

ko.applyBindings(new ViewModel())
