import * as ko from 'knockout'

export type LazyComponentConfig = { [k: string]: () => Promise<any> }

export class LazyComponentLoader implements KnockoutComponentTypes.Loader {
  constructor(private components: LazyComponentConfig) {
    Object.keys(this.components).forEach((name) => ko.components.register(name, {}))
  }

  public getConfig(name: string, cb: (comfig: null | KnockoutComponentTypes.Config) => void) {
    if (!this.components[name]) return cb(null)

    this.components[name]()
      .then((config) => cb({ synchronous: true, ...(config.default || config) }))
      .catch((e) => {
        // tslint:disable-next-line no-console
        console.error('Error loading component:', name, e.message)
      })
  }
}
