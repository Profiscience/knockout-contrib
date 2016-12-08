'use strict' // eslint-disable-line

const path = require('path')

module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['tap'],

    files: [
      'node_modules/regenerator-runtime/runtime.js',
      'test/index.js'
    ],

    preprocessors: {
      'test/index.js': 'webpack'
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
            exclude: [
              path.resolve('src'),
              path.resolve('node_modules')
            ],
            loader: 'babel',
            query: {
              cacheDirectory: true
            }
          },
          {
            test: /\.js$/,
            include: path.resolve('src'),
            loader: 'isparta'
          }
        ]
      },

      babel: {
        plugins: [
          'transform-object-rest-spread',
          'transform-es2015-modules-commonjs',
          'transform-regenerator'
        ],
        presets: [
          'es2015',
          'es2017'
        ]
      },

      isparta: {
        embedSource: true,
        noAutoWrap: true,
        babel: {
          plugins: [
            'transform-es2015-modules-commonjs',
            'transform-regenerator'
          ],
          presets: [
            'es2015',
            'es2017'
          ]
        },
      }
    },

    webpackMiddleware: {
      noInfo: true
    }
  })
}
