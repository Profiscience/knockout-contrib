'use strict'

const path = require('path')
const { gzip } = require('zlib')
const execa = require('execa')
const { each, padEnd, round } = require('lodash')
const { green } = require('chalk')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

const { LERNA_PACKAGE_NAME } = process.env
const PACKAGE_PATH = process.cwd()
const pkg = require(path.join(PACKAGE_PATH, 'package.json'))

const cache = {}

exports.build = function* (task) {
  console.log(`🚀 Building ${LERNA_PACKAGE_NAME}`)

  yield task.clear(pkg.files)
  yield task.serial(['transpile', 'bundle', 'stats'])
}

exports.transpile = function* (task) {
  yield execa('tsc', { stdio: 'inherit' })
}

exports.bundle = function* (task) {
  yield task
    .source(path.resolve(process.cwd(), pkg.module))
    .rollup({
      cache: cache.bundle,
      external: ['knockout'],
      plugins: [
        nodeResolve({
          preferBuiltins: false
        }),
        commonjs()
      ],
      output: {
        file: pkg.main,
        format: 'umd',
        globals: {
          knockout: 'ko'
        },
        name: pkg.global
      }
    })
    .target(PACKAGE_PATH)

    .uglify()
    .rename({ suffix: '.min' })
    .target(path.resolve(PACKAGE_PATH))
}

exports.stats = function* (task) {
  const stats = []

  yield task
    .source(path.resolve(process.cwd(), 'knockout-contrib-*.js'))
    .run({ every: true }, function * ({ base: name, data }) {
      const gzipped = yield new Promise((resolve) => gzip(data, (_, result) => resolve(result)))
      const kilobytes = round(Buffer.byteLength(data, 'utf8') / 1000)
      const compressedKilobytes = round(Buffer.byteLength(gzipped, 'utf8') / 1000)

      stats.push([name, kilobytes, compressedKilobytes])
    })
    // eslint-disable-next-line require-yield
    .run({ every: false }, function * () {
      /* eslint-disable no-console */
      const border = '-------------------------------------------------------------'
      console.log(green(border))
      each(stats, ([name, raw, gzipped]) =>
        console.log(green(
          '|',
          padEnd(
            (padEnd(name, 'ko-contrib-fns.min.js'.length) + `\t~${raw}kb\t~${gzipped}kb gzipped`),
            border.length - 5
          ),
          '|')))
      console.log(green(border))
      /* eslint-enable no-console */
    })
}


// import * as path from 'path'
// import * as fs from 'fs-extra'
// import * as globby from 'globby'

// export async function meta(task) {
//   await task
//     .source(path.join(__dirname, 'packages/*/.meta'))
//     .run({ every: true }, function * (file) {
//       const packageName = path.basename(file.dir)
//       const canTreeShake = file.data.toString('utf8') === 'treeshake'

//       if (canTreeShake) {
//         this._.files = yield generateES2015Files()
//       } else {

//       }
//     })
//     .target('./foo')
// }
