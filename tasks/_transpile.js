'use strict'

const execa = require('execa')

module.exports = {
  *'transpile'() {
    yield transpile()
  },
  *'transpile:watch'() { // eslint-disable-line require-yield
    transpile(true)
  }
}

async function transpile(watch) {
  let cmd = '../../node_modules/.bin/tsc'
  if (watch) {
    cmd += ' --watch'
  }
  await execa(cmd, { stdio: 'inherit' })
}