'use strict' // eslint-disable-line

const path = require('path')

module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['tap'],

    files: ['test.js'],

    preprocessors: {
      'test.js': 'webpack'
    },

    browsers: ['Debug'],

    customLaunchers: {
      Debug: {
        base: 'Chrome',
        flags: ['--incognito', '--user-data-dir=./.chrome']
      }
    },

    logLevel: config.LOG_INFO,

    autoWatch: true,

    reporters: ['dots'],

    webpack: {
      node: {
        fs: 'empty'
      },
      module: {
        preLoaders: [
          {
            test: /\.js$/,
            loader: 'babel',
            exclude: path.resolve('node_modules'),
            query: {
              plugins: [
                'transform-es2015-modules-commonjs',
              ],
              presets: ['es2015']
            }
          }
        ]
      },
      devtool: 'eval-source-map'
    },

    webpackMiddleware: {
      noInfo: true
    }
  })
}
