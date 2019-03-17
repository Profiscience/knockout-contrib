import * as fs from 'fs-extra'
import * as path from 'path'
import * as Bluebird from 'bluebird'

/**
 * Use Bluebird for promises
 */
;(global as any).Promise = Bluebird

/**
 * Use eventemitter3 instead of Node's events module
 */
if (!fs.existsSync('node_modules/events/.patched')) {
  fs.removeSync(path.join(__dirname, 'node_modules/events'))
  fs.ensureDirSync(path.join(__dirname, 'node_modules/events'))
  fs.writeFileSync(
    path.join(__dirname, 'node_modules/events/index.js'),
    'module.exports = require("eventemitter3")'
  )
  fs.ensureFileSync(path.join(__dirname, 'node_modules/events/.patched'))
}
