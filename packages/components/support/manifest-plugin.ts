import * as fs from 'fs'
import * as path from 'path'
import { promisify as pify } from 'util'

const readdir = pify(fs.readdir)
const readFile = pify(fs.readFile)
const writeFile = pify(fs.writeFile)

const hot = true // @TODO make configurable

export class KnockoutComponentManifestWebpackPlugin {
  constructor(private dir: string) {}

  public apply(compiler: any) {
    const pluginName = 'KnockoutComponentManifestPlugin'
    compiler.hooks.beforeRun.tapPromise(pluginName, () => generateComponentsManifest(this.dir))
    compiler.hooks.watchRun.tapPromise(pluginName, () => generateComponentsManifest(this.dir))
  }
}

async function generateComponentsManifest(dir: string) {
  const components = (await readdir(dir)).filter(isDirectory)
  const outFile = path.resolve(dir, 'index.ts')
  let code = generateManifest(dir, components)
  if (hot) {
    code += generateHMR(dir, components)
  }
  if (await isUnchanged(outFile, code)) {
    return
  }
  await writeFile(outFile, code)
}

function isDirectory(f: string) {
  return path.extname(f) === ''
}

async function isUnchanged(file: string, contents: string) {
  return fs.existsSync(file) && Buffer.from(contents).equals(await readFile(file))
}

function generateManifest(src: string, components: string[]) {
  return `
  var manifest = { ${components.map((c) => generateComponentImport(src, c)).join(',')} }
  export default manifest
  `
}

function generateComponentImport(src: string, component: string) {
  const isAppComponent = component.indexOf('app') === 0
  const webpackMode = isAppComponent ? 'eager' : 'lazy'
  // tslint:disable max-line-length
  return `'${component}': function(){ return import(/* webpackMode: "${webpackMode}", webpackChunkName: "${component}-component" */ '${path.resolve(src, component)}') }`
}

function generateHMR(src: string, components: string[]) {
  return `
    import * as ko from 'knockout'

    var readys = new Map()

    ko.components.loaders.unshift({
      loadComponent: function(name, componentConfig, cb) {
        if (!manifest[name]) return cb(null)
        readys.set(name, ko.observable(true))
        ko.components.register('__' + name + '__', componentConfig)
        if (!componentConfig.viewModel) componentConfig.viewModel = function EmptyViewModel() {}
        cb(null)
      },
      loadTemplate: function(name, templateConfig, cb) {
        if (!manifest[name]) return cb(null)
        const $wrapper = document.createElement('span')
        const $component = document.createElement('span')
        $wrapper.setAttribute('data-bind', 'if: ready')
        $component.setAttribute('data-bind', 'component: { name: "__' + name + '__", params: params }')
        $wrapper.appendChild($component)
        cb([$wrapper])
      },
      loadViewModel: function(name, viewModelConfig, cb) {
        if (!manifest[name]) return cb(null)
        cb(function(params) {
          return { ready: readys.get(name), params: params }
        })
      }
    })

    if (module.hot) {
      function createAcceptHandler(componentName) {
        return function() {
          var ready = readys.get(componentName)
          var hotComponentName = '__' + componentName + '__'
          ready(false)
          ko.components.unregister(hotComponentName)
          ko.components.clearCachedDefinition(hotComponentName)
          manifest[componentName]().then(function(config) {
            ko.components.register(hotComponentName, config)
            ready(true)
          })
        }
      }
      ${
        components
          .map((c) => `module.hot.accept('${path.resolve(src, c)}', createAcceptHandler('${c}'))`)
          .join('\n')
      }
    }
  `
}
