// tslint:disable:max-classes-per-file

import * as ko from 'knockout'

/**
 * Monolithic loader that registers an entire component directory using the webpack
 * require context. Supports lazy-loading and style registration/disposal.
 *
 * Chaining/composing loaders with the built-in component loader stack is weird,
 * and hard to understand, so this, while not modular and very specific to UniversitySite,
 * is a lot easier to reason about.
 *
 * This shouldn't change much, if at all, so it isn't worth implementing a more
 * sophisticated mixin pattern.
 */
export class ComponentLoader implements ko.components.Loader {
  /**
   * @param context require.context() return value
   */
  constructor(
    private manifest: { [name: string]: () => Promise<ko.components.Config> }
  ) {
    Object.keys(manifest).forEach((name) =>
      // see http://knockoutjs.com/documentation/component-custom-elements.html#registering-custom-elements
      ko.components.register(name, {})
    )
  }

  public getConfig(name: string, cb: (config: ko.components.Config) => void) {
    if (!this.manifest[name]) return cb(null as any)
    this.manifest[name]().then((c: any) => {
      // clone, otherwise will throw an error if there are styles and an existing viewModel b/c
      // the object recieved has non-configurable properties (that can't be overwritten)
      const config = {
        ...c,
        synchronous: true
      }
      if (config.styles) patchStyles(config)
      cb(config)
    })
  }
}

function patchStyles(config: any) {
  const styles = config.styles
  if (!config.viewModel) {
    config.viewModel = ViewModelStylesMixin(
      styles,
      class {
        constructor(params: any) {
          Object.assign(this, params)
        }
      }
    )
  } else if (config.viewModel.createViewModel) {
    const _createViewModel = config.viewModel.createViewModel
    config.viewModel = {
      createViewModel(params: any, componentInfo: any) {
        const vm = _createViewModel(params, componentInfo)
        const _dispose = vm.dispose
          ? vm.dispose.bind(vm)
          : () => {
              /* noop */
            }
        styles.use()
        vm.dispose = () => {
          _dispose()
          styles.unuse()
        }
        return vm
      }
    }
  } else {
    config.viewModel = ViewModelStylesMixin(config.styles, config.viewModel)
  }
}

function ViewModelStylesMixin<T extends { new (...args: any[]): any }>(
  styles: { use(): void; unuse(): void },
  ctor: T
) {
  return class extends ctor {
    constructor(...args: any[]) {
      super(...args)
      styles.use()
    }
    public dispose() {
      if (super.dispose) super.dispose()
      styles.unuse()
    }
  }
}
