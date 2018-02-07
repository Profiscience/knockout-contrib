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
    var manifest = { ${components.map((c) => `'${c}': function(){ return import('${path.resolve(src, c)}') }`).join(',')} }
    export default manifest
  `
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
        $component.setAttribute('data-bind', 'component: { name: "__" + name + "__", params: $data }')
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

    ${
      components
        .map((c) => `
          module.hot.accept('${path.resolve(src, c)}', function() {
            var ready = readys.get('${c}')
            ready(false)
            ko.components.unregister('__${c}__')
            ko.components.clearCachedDefinition('__${c}__')
            manifest['${c}']().then(function(config) {
              ko.components.register('__${c}__', config)
              ready(true)
            })
          })
        `)
        .join('\n')
    }
  `
}
