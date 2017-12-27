'use strict'

const fs = require('fs')
const path = require('path')
const tasks = fs.readdirSync(path.resolve(__dirname, 'tasks'))

for (const t of tasks) {
  Object.assign(exports, require(`./tasks/${t}`))
}