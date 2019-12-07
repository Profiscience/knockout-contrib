import * as ko from 'knockout'

export type ComponentLoaderManifest = Record<
  string,
  () => Promise<ko.components.Config>
>

type RequireContext = {
  (key: string): any
  keys(): any[]
}

export class LazyComponentLoader implements ko.components.Loader {
  constructor(private manifest: ComponentLoaderManifest) {
    Object.keys(manifest).forEach((name) =>
      // see http://knockoutjs.com/documentation/component-custom-elements.html#registering-custom-elements
      ko.components.register(name, {})
    )
  }

  public getConfig(name: string, cb: (config: ko.components.Config) => void) {
    const loadComponent = this.manifest[name]
    if (!loadComponent) return cb((null as unknown) as ko.components.Config) // bad types -__-
    loadComponent().then((c) => cb(c))
  }

  public static fromRequireContext(_require: RequireContext) {
    return new LazyComponentLoader(
      _require
        .keys()
        .map((k) => ({
          path: k,
          name: k.match(/[\\\/]([^\\\/]+)/)[1]
        }))
        .reduce(
          (manifest, { name, path }) => ({
            ...manifest,
            [name]: () => _require(path)
          }),
          {}
        )
    )
  }
}
