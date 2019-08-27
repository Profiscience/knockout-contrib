import * as ko from 'knockout'

type MaybeAccessor<T> = T | (() => T)
type MaybePromise<T> = T | Promise<T>

export type ComponentLoaderManifest<T = ko.components.Config> = Record<
  string,
  MaybeAccessor<MaybePromise<T>>
>

export type ComponentLoaderOptions<T = ko.components.Config> = {
  transform?(config: T): MaybePromise<ko.components.Config>
}

type RequireContext = {
  (key: string): any
  keys(): any[]
}

export class ComponentLoader<T = ko.components.Config>
  implements ko.components.Loader {
  constructor(
    private readonly manifest: ComponentLoaderManifest<T>,
    private readonly options: ComponentLoaderOptions<T> = {}
  ) {
    Object.keys(manifest).forEach((name) =>
      // see http://knockoutjs.com/documentation/component-custom-elements.html#registering-custom-elements
      ko.components.register(name, {})
    )
  }

  public async getConfig(
    name: string,
    cb: (config: ko.components.Config) => void
  ): Promise<void> {
    const loadComponent = this.manifest[name]
    if (!loadComponent) return cb((null as unknown) as ko.components.Config) // bad types -__-
    const c: T =
      typeof loadComponent === 'function'
        ? await (loadComponent as () => MaybePromise<T>)()
        : await (loadComponent)
    cb(this.options.transform ? await this.options.transform(c) : c)
  }

  public static fromRequireContext(_require: RequireContext): ComponentLoader {
    return new ComponentLoader(
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
