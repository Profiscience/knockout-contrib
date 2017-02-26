exports.build = function * (fly) {
  yield fly.parallel(['modules', 'umd'])
}

exports.modules = function * (fly) {
  yield fly.source('src/*.js')
    .babel({
      babelrc: false,
      presets: [
        ['es2015', { modules: false }]
      ]
    })
    .target('dist/modules')
}

exports.umd = function * (fly) {
  yield fly.source('src/index.js')
    .rollup({
      rollup: {
        plugins: [
          require('rollup-plugin-babel')({
            babelrc: false,
            presets: [['es2015', { modules: false }]]
          })
        ],
        external: ['knockout']
      },
      bundle: {
        format: 'iife',
        moduleName: 'ko.utils',
        globals: {
          knockout: 'ko'
        }
      }
    })
    .concat({ output: 'ko-contrib-utils.js' })
    .target('dist')
}
