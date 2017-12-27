'use strict'

const path = require('path')
const CSSModuleDtsGenerator = require('typed-css-modules')

const PACKAGE_PATH = process.cwd()
const dist = path.join(PACKAGE_PATH, 'dist')

module.exports = {
  *'styles'(task) {
    yield task
      .source(path.join(PACKAGE_PATH, '*.css'))
      .postcss({
        plugins: [
          require('postcss-cssnext')
        ]
      })
      .target(dist)

      .run({ every: true }, function* (file) {
        const dtsGenerator = new CSSModuleDtsGenerator()
        yield dtsGenerator.create(file.base, file.data.toString()).then(async (content) => {
          if (content.messageList.length > 0) {
            console.log('\n\n') // eslint-disable-line no-console
            content.messageList.forEach((m) => console.error(m)) // eslint-disable-line no-console
            console.error('\n\nuse camelCased css classes in css modules\n\n') // eslint-disable-line no-console
            process.exit(1)
          }
          await content.writeFile()
        })
      })
  },
  *'styles:watch'(task) {
    yield task.watch('*.css', ['styles'])
  }
}