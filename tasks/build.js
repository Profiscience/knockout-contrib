'use strict'

const path = require('path')
const { without } = require('lodash')

const PACKAGE_PATH = process.cwd()
const PACKAGE_NAME = path.basename(PACKAGE_PATH)
const pkg = require(path.join(PACKAGE_PATH, 'package.json'))
const tsconfig = require(path.join(PACKAGE_PATH, 'tsconfig.json'))
const dist = path.join(PACKAGE_PATH, 'dist')

exports.build = function* (task) {
  const tasks = ['transpile']
  const isNodePkg = tsconfig.compilerOptions.module === 'commonjs' // e.g. jest-matchers
  const isComponent = /components\./.test(PACKAGE_NAME)

  yield task.clear([dist, ...without(pkg.files, 'webpack.js')])

  if (isComponent) {
    tasks.unshift('styles')
  }
  if (!isNodePkg) {
    tasks.push('bundle')
  }

  yield task.serial(tasks)
}