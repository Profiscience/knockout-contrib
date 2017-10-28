const path = require('path')
const { gzip } = require('zlib')
const { each, padEnd, round } = require('lodash')
const { green } = require('chalk')

module.exports = {
  * stats(fly) {
    const stats = []

    yield fly.source(path.resolve(__dirname, '../dist/*.js'))
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
              (padEnd(name, 'dist/ko-contrib-utils.min.js'.length) + `\t~${raw}kb\t~${gzipped}kb gzipped`),
              border.length - 5
            ),
            '|')))
        console.log(green(border))
        /* eslint-enable no-console */
      })
  }
}
