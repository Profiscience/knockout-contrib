const path = require('path')
const spawn = require('cross-spawn')

module.exports = {
  * test(fly) {
    yield fly.start('bundle')
    yield new Promise((resolve, reject) => {
      const ava = spawn('nyc', ['--reporter=json', 'ava', '--verbose'], { stdio: 'inherit' })
      ava.on('close', (code) => code === 0 ? resolve() : reject())
    })
    yield fly.start('cover')
  },
  * 'test:watch'(fly) {
    yield fly.watch([
      path.resolve(__dirname, '../src/*.ts'),
      path.resolve(__dirname, '../test/*.js')
    ], 'test')
  },
  * cover(fly) {
    yield fly.parallel(['cover:html', 'cover:lcov'])
  },
  * 'cover:html'() {
    yield new Promise((resolve) => {
      const remap = spawn('remap-istanbul', [
        '-i', 'coverage/coverage-final.json',
        '-o', 'coverage/html',
        '-t', 'html'
      ], { stdio: 'inherit' })
      remap.on('close', resolve)
    })
  },
  * 'cover:lcov'() {
    yield new Promise((resolve) => {
      const remap = spawn('remap-istanbul', [
        '-i', 'coverage/coverage-final.json',
        '-o', 'coverage/lcov.info',
        '-t', 'lcovonly'
      ], { stdio: 'inherit' })
      remap.on('close', resolve)
    })
  }
}
