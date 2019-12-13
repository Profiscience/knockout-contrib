import * as ko from 'knockout'

type MaybePromise<T> = T | Promise<T>

export type ComponentLoaderManifest<T = ko.components.Config> = Record<
  string,
  () => Promise<T>
>

export type ComponentLoaderOptions<T = ko.components.Config> = {
  transform?(config: T): MaybePromise<ko.components.Config>
}

type RequireContext = {
  (key: string): any
  keys(): any[]
}

export class LazyComponentLoader<T = ko.components.Config>
  implements ko.components.Loader {
  constructor(
    private manifest: ComponentLoaderManifest<T>,
    private options: ComponentLoaderOptions<T> = {}
  ) {
    Object.keys(manifest).forEach((name) =>
      // see http://knockoutjs.com/documentation/component-custom-elements.html#registering-custom-elements
      ko.components.register(name, {})
    )
  }

  public getConfig(
    name: string,
    cb: (config: ko.components.Config) => void
  ): void {
    const loadComponent = this.manifest[name]
    if (!loadComponent) return cb((null as unknown) as ko.components.Config) // bad types -__-
    loadComponent().then(async (_c) => {
      cb(this.options.transform ? await this.options.transform(_c) : _c)
    })
  }

  public static fromRequireContext(
    _require: RequireContext
  ): LazyComponentLoader {
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
