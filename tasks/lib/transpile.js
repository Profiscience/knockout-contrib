'use strict'

const execa = require('execa')

exports.typescript = function* () {
  yield execa('tsc', { stdio: 'inherit' })
}
