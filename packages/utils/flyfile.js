Object.assign(exports, require('./tasks/bundle'))
Object.assign(exports, require('./tasks/modules'))
Object.assign(exports, require('./tasks/stats'))
Object.assign(exports, require('./tasks/test'))
Object.assign(exports, require('./tasks/typings'))
Object.assign(exports, require('./tasks/umd'))

exports.build = function * (fly) {
  yield fly.parallel(['modules', 'umd', 'typings', 'bundle'])
  yield fly.start('stats')
}

exports.watch = function * (fly) {
  yield fly.start('build')
  yield fly.watch('src/*.ts', ['build', 'test'])
}
