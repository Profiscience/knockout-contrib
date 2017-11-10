'use strict'

const path = require('path')
const execa = require('execa')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

const { LERNA_PACKAGE_NAME } = process.env
const PACKAGE_PATH = process.cwd()
const pkg = require(path.join(PACKAGE_PATH, 'package.json'))
const tsconfig = require(path.join(PACKAGE_PATH, 'tsconfig.json'))

const cache = {}

exports[`build:${LERNA_PACKAGE_NAME}`] = function* (task) {
  const tasks = [`transpile:${LERNA_PACKAGE_NAME}`]

  yield task.clear(pkg.files)

  // don't bundle node-only code, i.e. jest-matchers
  if (tsconfig.compilerOptions.module !== 'commonjs') {
    tasks.push(`bundle:${LERNA_PACKAGE_NAME}`)
  }
  
  yield task.serial(tasks)
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
      external: [
        'jquery',
        'knockout',
        'knockout-punches'
      ],
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
          jquery: '$',
          knockout: 'ko'
        },
        name: pkg.global
      }
    })
    .target(dist)

    .uglify()
    .rename({ suffix: '.min' })
    .target(dist)
}