'use strict'
require('ts-node').register({ compilerOptions: { target: 'esnext', module: 'commonjs' } })
Object.assign(exports, require('./tasks'))