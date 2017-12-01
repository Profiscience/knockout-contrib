'use strict'

const path = require('path')
const { gzip } = require('zlib')
let _; const { padEnd, padStart, round } = _ = require('lodash')
const { green } = require('chalk')

module.exports = function* (task) {
  const stats = [
    yield getModuleStats(task),
    ...(yield getBundleStats(task))
  ]

  const border = '--------------------------------------------------------------------------------------'
  const padNameWidth = 'knockout-contrib-observable-fn-subscribe-once.min.js'.length + 3
  const padUncompressedWidth = '~XXXkb'.length + 3
  const padRightWidth = border.length - 4 - padNameWidth - padUncompressedWidth
  console.log(green(border)) // eslint-disable-line no-console
  _(stats)
    .sortBy(([name]) => name)
    .each(([name, raw, gzipped]) =>
      console.log(green(  // eslint-disable-line no-console
        '|',
        (
          padEnd(name, padNameWidth) +
          padStart(`~${raw}kb`, padUncompressedWidth) +
          padStart(`~${gzipped}kb gzipped`, padRightWidth)
        ),
        '|')))
  console.log(green(border))  // eslint-disable-line no-console
}

async function getModuleStats(task) {
  let combined = ''
  await task
    .source(path.resolve(__dirname, '../packages/*/dist/*.js'))
    .run({ every: true }, function * ({ data }) { // eslint-disable-line require-yield
      combined += data
    })
  const kilobytes = round(Buffer.byteLength(combined, 'utf8') / 1000)
  const compressedKilobytes = await getGzippedSize(combined)
  return ['packages/*/dist/*.js', kilobytes, compressedKilobytes]
}

async function getBundleStats(task) {
  const stats = []
  await task
    .source(path.resolve(__dirname, '../packages/*/knockout-contrib-*.js'))
    .run({ every: true }, function * ({ base: name, data }) {
      const kilobytes = round(Buffer.byteLength(data, 'utf8') / 1000)
      const compressedKilobytes = yield getGzippedSize(data)
      stats.push([name, kilobytes, compressedKilobytes])
    })
  return stats
}

async function getGzippedSize(raw) {
  return await new Promise((resolve) => gzip(raw, (_, gzipped) =>
    resolve(round(Buffer.byteLength(gzipped, 'utf8') / 1000))))
}