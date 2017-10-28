'use strict'

exports.clean = require('../../tasks/lib/clean')(__dirname)
exports.compile = require('../../tasks/lib/transpile').typescript
exports.bundle = require('../../tasks/lib/bundle')(__dirname, 'ko.router')
exports.stats = require('./tasks/stats')
Object.assign(exports, require('./tasks/test'))

exports.build = function* (task) {
  yield task.clear(['dist', 'ko-contrib-*.js')
  yield task.serial(['compile', 'bundle', 'stats'])
}

exports.watch = function * (task) {
  yield task.start('build')
  yield task.watch('src/*.ts', 'build')
}
