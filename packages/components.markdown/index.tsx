import { h } from 'jsx-dom'
import * as ko from 'knockout'
import { ViewModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-view'
import marked from 'marked'
import { MarkedOptions } from 'marked'

export type MarkdownComponentParams = {
  content: string | KnockoutObservable<string>
  options: MarkedOptions
}

export class MarkdownViewModel extends ViewModelConstructorBuilder {
  private readonly options: MarkedOptions
  public html = ko.observable('')

  constructor(params: MarkdownComponentParams) {
    super()
    this.options = params.options
    this.render(ko.unwrap(params.content))
    this.subscribe(params.content, this.render.bind(this))
  }

  private render(content: string) {
    marked(content, this.options || {}, (err, res) => {
      /* istanbul ignore next */
      if (err) this.html(err.message)
      else this.html(res)
    })
  }
}

const template = [
  <div data-bind='html: html'></div>
]

export default {
  synchronous: true,
  template,
  viewModel: MarkdownViewModel
}
