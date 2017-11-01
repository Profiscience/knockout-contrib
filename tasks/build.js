'use strict'

const path = require('path')
const execa = require('execa')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

const { LERNA_PACKAGE_NAME } = process.env
const PACKAGE_PATH = process.cwd()
const pkg = require(path.join(PACKAGE_PATH, 'package.json'))

const cache = {}

exports[`build:${LERNA_PACKAGE_NAME}`] = function* (task) {
  yield task.clear(pkg.files)
  yield task.serial([`transpile:${LERNA_PACKAGE_NAME}`, `bundle:${LERNA_PACKAGE_NAME}`])
}

exports[`transpile:${LERNA_PACKAGE_NAME}`] = function* (task) {
  yield execa('../../node_modules/.bin/tsc', { stdio: 'inherit' })
}

exports[`bundle:${LERNA_PACKAGE_NAME}`] = function* (task) {
  const dist = path.join(process.cwd(), path.dirname(pkg.main))
  const bundle = path.basename(pkg.main)
  
  yield task
    .source(path.resolve(process.cwd(), pkg.module))
    .rollup({
      cache: cache[bundle],
      external: ['knockout'],
      plugins: [
        nodeResolve({
          preferBuiltins: false
        }),
        commonjs()
      ],
      output: {
        file: bundle,
        format: 'umd',
        globals: {
          knockout: 'ko'
        },
        name: pkg.global || 'VOID'
      }
    })
    .target(dist)

    .uglify()
    .rename({ suffix: '.min' })
    .target(dist)
}