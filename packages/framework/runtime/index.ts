import * as ko from 'knockout'
import 'knockout-punches'

import * as components from './components.js'
import * as routing from './routing.js'

export type KnockoutContribFrameworkConfig = {
  hashbang?: boolean
  activePathCSSClass?: string
  base?: string
}

export class App {
  constructor(public config: KnockoutContribFrameworkConfig) {
    const _ko: any = ko
    const _window: any = window
    ko.options.deferUpdates = true
    _ko.punches.enableAll()
    _window.ko = ko
  }

  public async start() {
    components.initialize()
    await routing.initialize(this.config)
    ko.applyBindings()
  }
}
