'use strict'

const path = require('path')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

let cache

module.exports = (dir, globalNamespace) => function * bundle(task) {
  const { main } = require(path.join(dir, 'package.json'))

  yield task
    .source(path.resolve(dir, 'dist/index.js'))
    .rollup({
      cache,
      external: ['knockout'],
      plugins: [
        nodeResolve({
          preferBuiltins: false
        }),
        commonjs()
      ],
      output: {
        file: main,
        format: globalNamespace ? 'umd' : 'iife',
        globals: {
          knockout: 'ko'
        },
        name: globalNamespace
      }
    })
    .target(dir)

    .uglify()
    .rename({ suffix: '.min' })
    .target(path.resolve(dir))
}