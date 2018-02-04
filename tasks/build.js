'use strict'

const fs = require('fs')
const path = require('path')
const { promisify: pify } = require('util')
const { padEnd, without } = require('lodash')

const { TRAVIS } = process.env
const PACKAGE_PATH = process.cwd()
const PACKAGE_NAME = path.basename(PACKAGE_PATH)
const pkg = require(path.join(PACKAGE_PATH, 'package.json'))
const dist = path.join(PACKAGE_PATH, 'dist')

exports.build = function* (task) {
  const tasks = ['transpile']
  const isComponent = /components\./.test(PACKAGE_NAME)

  yield task.clear([dist, ...without(pkg.files, 'webpack.js')])

  if (isComponent) {
    tasks.unshift('styles')
  }

  yield task.serial(tasks)

  if (TRAVIS) {
    process.nextTick(() => console.log(''))
  }
}

if (TRAVIS) {
  const packages = fs.readdirSync(path.resolve(__dirname, '../packages'))
  const total = packages.length
  const maxPackageName = Math.max(...packages.map((p) => p.length))
  let current
  try {
    current = parseInt(fs.readFileSync(path.resolve(__dirname, './TASK_COUNT')).toString(), 10)
  } catch (e) {
    current = 1
  } finally {
    console.log(padEnd(`🚀  Building ${current}/${total}: ${PACKAGE_NAME}`, maxPackageName + 20), progressBar())
    fs.writeFileSync(path.resolve(__dirname, './TASK_COUNT'), ++current)
  }

  function progressBar() {
    const width = 50
    const inflection = (current / total) * width
    let str = '['
    for (let i = 0; i < width; i++) {
      str += i < inflection ? '=' : '-'
    }
    str += ']'
    return str
  }
}