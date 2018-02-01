'use strict'

const path = require('path')
const { without } = require('lodash')

const PACKAGE_PATH = process.cwd()
const PACKAGE_NAME = path.basename(PACKAGE_PATH)
const pkg = require(path.join(PACKAGE_PATH, 'package.json'))
const dist = path.join(PACKAGE_PATH, 'dist')

exports.build = function* (task) {
  const tasks = ['transpile']
  const isComponent = /components\./.test(PACKAGE_NAME)

  yield task.clear([dist, ...without(pkg.files, 'webpack.js')])

  if (isComponent) {
    tasks.unshift('styles')
  }

  yield task.serial(tasks)
}