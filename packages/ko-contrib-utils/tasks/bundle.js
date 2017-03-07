const path = require('path')
const { extend } = require('lodash')
const typescript = require('typescript')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const { default: typescriptPlugin } = require('rollup-plugin-ts')
const { compilerOptions } = require('../tsconfig.json')

let cache

module.exports = {
  * bundle(fly) {
    yield fly.source(path.resolve(__dirname, '../src/index.ts'))
      .rollup({
        rollup: {
          cache,
          plugins: [
            typescriptPlugin({
              typescript,
              tsconfig: extend({}, compilerOptions, { sourceMap: false })
            }),
            nodeResolve({
              preferBuiltins: false
            }),
            commonjs()
          ],
          external: ['knockout']
        },
        bundle: {
          format: 'umd',
          sourceMap: 'inline',
          moduleName: 'ko.utils',
          globals: {
            knockout: 'ko'
          }
        }
      })
      .rename({ basename: 'ko-contrib-utils', extname: '.js' })
      .target(path.resolve(__dirname, '../dist'))

      .rename({ suffix: '.min' })
      .uglify()
      .target(path.resolve(__dirname, '../dist'))
  }
}
