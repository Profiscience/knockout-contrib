'use strict'

const path = require('path')
const execa = require('execa')
const CSSModuleDtsGenerator = require('typed-css-modules')

const PACKAGE_PATH = process.cwd()
const PACKAGE_NAME = path.basename(PACKAGE_PATH)
const pkg = require(path.join(PACKAGE_PATH, 'package.json'))
const tsconfig = require(path.join(PACKAGE_PATH, 'tsconfig.json'))
const dist = path.join(PACKAGE_PATH, 'dist')

exports.build = function* (task) {
  const tasks = ['transpile']
  const isNodePkg = tsconfig.compilerOptions.module === 'commonjs' // e.g. jest-matchers
  const isComponent = /components-/.test(PACKAGE_NAME)

  yield task.clear(dist)

  if (isComponent) {
    tasks.unshift('styles')
  }

  if (!isNodePkg) {
    tasks.push('bundle')
  }

  yield task.serial(tasks)
}

exports.styles = function* (task) {
  yield task
    .source(path.resolve(process.cwd(), '*.css'))
    .postcss({
      plugins: [
        require('postcss-cssnext')
      ]
    })
    .target(dist)

    .run({ every: true }, function* (file) {
      const dtsGenerator = new CSSModuleDtsGenerator()
      yield dtsGenerator.create(file.base, file.data.toString()).then(async (content) => {
        if (content.messageList.length > 0) {
          console.log('\n\n') // eslint-disable-line no-console
          content.messageList.forEach((m) => console.error(m)) // eslint-disable-line no-console
          console.error('\n\nuse camelCased css classes in css modules\n\n') // eslint-disable-line no-console
          process.exit(1)
        }
        await content.writeFile()
      })
    })
}

exports.transpile = function* () {
  yield execa('../../node_modules/.bin/tsc', { stdio: 'inherit' })
}

exports.bundle = function* (task) {
  const plugins = [
    require('rollup-plugin-node-resolve')({ preferBuiltins: false }),
    require('rollup-plugin-commonjs')()
  ]

  if (/components/.test(PACKAGE_NAME)) {
    const cssExportMap = {}
    const p = require('rollup-plugin-postcss')({
      plugins: [
        require('postcss-modules')({
          getJSON(id, exportTokens) {
            cssExportMap[id] = exportTokens
          }
        })
      ],
      getExportNamed: true,
      getExport: (id) => cssExportMap[id],
      extract: path.join(dist, `${path.basename(pkg.main, '.js')}.css`)
    })
    // extract relies on the onwrite hook, but taskr-rollup doesn't use bundle.write, so fake it.
    p.ongenerate = () => p.onwrite({ file: true })
    plugins.push(p)
  }

  yield task
    .source(path.resolve(process.cwd(), pkg.module))
    .rollup({
      external: [
        'jquery',
        'knockout',
        'knockout-punches'
      ],
      plugins,
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