'use strict'

const path = require('path')
const execa = require('execa')
const CSSModuleDtsGenerator = require('typed-css-modules')

const { LERNA_PACKAGE_NAME } = process.env
const PACKAGE_PATH = process.cwd()
const pkg = require(path.join(PACKAGE_PATH, 'package.json'))
const tsconfig = require(path.join(PACKAGE_PATH, 'tsconfig.json'))
const dist = path.join(PACKAGE_PATH, 'dist')

const STYLES = `styles:${LERNA_PACKAGE_NAME}`
const BUILD = `build:${LERNA_PACKAGE_NAME}`
const TRANSPILE = `transpile:${LERNA_PACKAGE_NAME}`
const BUNDLE = `bundle:${LERNA_PACKAGE_NAME}`

exports[BUILD] = function* (task) {
  const tasks = [TRANSPILE]
  const isNodePkg = tsconfig.compilerOptions.module === 'commonjs' // e.g. jest-matchers
  const isComponent = /components-/.test(LERNA_PACKAGE_NAME)

  yield task.clear(dist)

  if (isComponent) {
    tasks.unshift(STYLES)
  }

  if (!isNodePkg) {
    tasks.push(BUNDLE)
  }

  task.serial(tasks)
}

exports[STYLES] = function* (task) {
  yield task
    .source(path.resolve(process.cwd(), '*.css'))
    .postcss({
      plugins: [
        require('postcss-cssnext')
      ]
    })
    .target(dist)

    .run({ every: true }, function* (file) {
      const dtsGenerator = new CSSModuleDtsGenerator({ camelCase: true })
      yield dtsGenerator.create(file.base, file.data.toString()).then((content) => content.writeFile())
    })
}

exports[TRANSPILE] = function* () {
  yield execa('../../node_modules/.bin/tsc', { stdio: 'inherit' })
}

exports[BUNDLE] = function* (task) {
  const cssExportMap = {}

  yield task
    .source(path.resolve(process.cwd(), pkg.module))
    .rollup({
      external: [
        'jquery',
        'knockout',
        'knockout-punches'
      ],
      plugins: [
        (() => {
          const p = require('rollup-plugin-postcss')({
            plugins: [
              require('postcss-modules')({
                getJSON(id, exportTokens) {
                  cssExportMap[id] = exportTokens
                }
              })
            ],
            getExport: (id) => cssExportMap[id],
            extract: path.join(dist, `${path.basename(pkg.main, '.js')}.css`)
          })
          // extract relies on the onwrite hook, but taskr-rollup does not use
          // bundle.write, so fake it.
          p.ongenerate = () => p.onwrite({ file: true })
          return p
        })(),
        require('rollup-plugin-node-resolve')({
          preferBuiltins: false
        }),
        require('rollup-plugin-commonjs')()
      ],
      output: {
        file: path.basename(pkg.main),
        format: 'umd',
        globals: {
          jquery: '$',
          knockout: 'ko'
        },
        name: pkg.global
      }
    })
    .target(dist)
}