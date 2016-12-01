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

    browsers: ['Firefox'],

    singleRun: true,

    reporters: ['dots', 'coverage'],

    coverageReporter: {
      dir : 'coverage/',
      reporters: [
        { type: 'html', subdir: 'html' },
        { type: 'lcovonly', subdir: '.', file: 'lcov.txt' }
      ]
    },

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
                'transform-es2015-modules-commonjs'
              ],
              presets: ['es2015']
            }
          },
          {
            test: /\.js$/,
            include: path.resolve('src/'),
            loader: 'isparta'
          }
        ]
      }
    },

    webpackMiddleware: {
      noInfo: true
    },

    isparta: {
      embedSource: true,
      noAutoWrap: true
    }
  })
}
