'use strict'

const path = require('path')
const PACKAGE_PATH = process.cwd()
const PACKAGE_DIR = path.basename(PACKAGE_PATH)
const PACKAGE_NAME = path.basename(PACKAGE_PATH)
const pkg = require(path.join(PACKAGE_PATH, 'package.json'))
const dist = path.join(PACKAGE_PATH, 'dist')

exports.bundle = function * (task) {
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
        name: `ko.contrib.${PACKAGE_DIR}`
      }
    })
    .target(dist)
}