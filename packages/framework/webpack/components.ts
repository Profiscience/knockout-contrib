import * as fs from 'fs'
import * as path from 'path'
import { promisify as pify } from 'util'

const readdir = pify(fs.readdir)
const readFile = pify(fs.readFile)
const writeFile = pify(fs.writeFile)
const mkdir = pify(fs.mkdir)

const hot = true
// ../knockout-contrib-framework
// ../../@profiscience
// ../../../node_modules
// ../../../../
const src = path.resolve(__dirname, '../../../../src/components')
const outDir = path.resolve(__dirname, '../build')
const outFile = path.join(outDir, 'COMPONENT_MANIFEST.js')

export async function generateComponentsManifest() {
  const components = (await readdir(src)).filter((f) => path.extname(f) === '')
  let code = generateManifest(components)
  if (hot) {
    code += generateHMR(components)
  }
  if (!fs.existsSync(outDir)) {
    await mkdir(path.resolve(__dirname, '../build'))
  } else if (fs.existsSync(outFile) && Buffer.from(code).equals(await readFile(outFile))) {
    return
  }
  await writeFile(outFile, code)
}

function generateManifest(components: string[]) {
  // tslint:disable max-line-length
  return `
    var manifest = { ${components.map((c) => generateComponentImport(c)).join(',')} }
    export default manifest
  `
}

function generateComponentImport(component: string) {
  const isAppComponent = component.indexOf('app') === 0
  const webpackMode = isAppComponent ? 'eager' : 'lazy'
  return `'${component}': function(){ return import(/* webpackMode: "${webpackMode}", webpackChunkName: "${component}-component" */ '${path.resolve(src, component)}') }`
}

function generateHMR(components: string[]) {
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
