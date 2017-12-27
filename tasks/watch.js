'use strict'

exports.watch = function* (task) {
  yield task.serial(['styles'])
  yield task.parallel(['styles:watch', 'transpile:watch'])
}