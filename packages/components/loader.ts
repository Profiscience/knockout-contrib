import * as ko from 'knockout'

export type LazyComponentConfig = { [k: string]: () => Promise<any> }

export class LazyComponentLoader implements KnockoutComponentTypes.Loader {
  constructor(private components: LazyComponentConfig) {
    Object.keys(this.components).forEach((name) => ko.components.register(name, {}))
  }

  public getConfig(name, cb) {
    if (!this.components[name]) return cb(null)

    this.components[name]()
      .then((config) => cb({ synchronous: true, ...(config.default || config) }))
      .catch((e) => {
        // tslint:disable-next-line no-console
        console.error('Error loading component:', name, e.message)
      })
  }
}

export async function __generateLazyComponentManifest(dir: string, { hot } = { hot: false }) {
  const [
    fs,
    path,
    { promisify }
  ] = await Promise.all([
      import('fs'),
      import('path'),
      import('util')
  ])
  const components = (await promisify(fs.readdir)(dir)).filter((f) => path.extname(f) === '')
  const contextDependencies = components.map((c) => path.resolve(dir, c))
  let code = generateManifest(components)
  if (hot) {
    code += 'module.hot.accept()'
    code += generateHMR(components)
  }
  return {
    code,
    contextDependencies,
    cacheable: true
  }
}

function generateManifest(components: string[]) {
  return `
    const manifest = { ${components.map((c) => `'${c}': () => import('./${c}')`).join(',')} }
    export default manifest
  `
}

function generateHMR(components: string[]) {
  return `
    import * as ko from 'knockout'

    const readys = new Map()

    ko.components.loaders.unshift({
      loadComponent(name, componentConfig, cb) {
        if (!manifest[name]) return cb(null)
        readys.set(name, ko.observable(true))
        ko.components.register(\`__\${name}__\`, componentConfig)
        if (!componentConfig.viewModel) {
          componentConfig.viewModel = class {}
        }
        cb(null)
      },
      loadTemplate(name, templateConfig, cb) {
        if (!manifest[name]) return cb(null)
        const $wrapper = document.createElement('span')
        const $component = document.createElement('span')
        $wrapper.setAttribute('data-bind', 'if: ready')
        $component.setAttribute('data-bind', \`component: { name: '__\${name}__', params: $data }\`)
        $wrapper.appendChild($component)
        cb([$wrapper])
      },
      loadViewModel(name, viewModelConfig, cb) {
        if (!manifest[name]) return cb(null)
        cb((params) => {
          console.log('createViewModel')
          return { ready: readys.get(name), params }
        })
      }
    })

    ${
      components
        .map((c) => `
          module.hot.accept('./${c}', () => {
            const ready = readys.get(${c})
            ready(false)
            ko.components.unregister('__${c}__')
            ko.components.clearCachedDefinition('__${c}__')
            manifest['${c}']().then((config) => {
              ko.components.register('__${c}__', config)
              ready(true)
            })
          })
        `)
        .join('\n')
    }
  `
}
