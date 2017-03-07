const spawn = require('cross-spawn')

module.exports = {
  * transpile() {
    yield new Promise((resolve) => {
      const tsc = spawn('tsc', [], { stdio: 'inherit' })
      tsc.on('close', resolve)
    })
  }
}
