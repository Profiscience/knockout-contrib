'use strict'

const fs = require('fs')
const path = require('path')
const { endsWith } = require('lodash')
const tasks = fs.readdirSync(path.resolve(__dirname, 'tasks'))

for (const t of tasks) {
  if (endsWith(t, '.ts')) {
    continue
  }
  Object.assign(exports, require(`./tasks/${t}`))
}