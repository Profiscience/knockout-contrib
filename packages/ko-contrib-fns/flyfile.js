Object.assign(exports, require('./tasks/bundle'))
Object.assign(exports, require('./tasks/stats'))
Object.assign(exports, require('./tasks/test'))
Object.assign(exports, require('./tasks/transpile'))

exports.build = function * (fly) {
  yield fly.parallel(['bundle', 'transpile'])
  yield fly.start('stats')
}

exports.watch = function * (fly) {
  yield fly.parallel(['build', 'test'])
  yield fly.watch(['src/*.ts', 'test/*.js'], ['build', 'test'])
}
