const path = require('path')
const spawn = require('cross-spawn')

module.exports = {
  * umd() {
    yield new Promise((resolve) => {
      const tsc = spawn('tsc', [
        '--module', 'umd',
        '--outDir', path.resolve(__dirname, '../dist/umd')
      ], { stdio: 'inherit' })
      tsc.on('close', resolve)
    })
  }
}
