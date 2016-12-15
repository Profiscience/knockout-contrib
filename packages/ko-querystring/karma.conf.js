'use strict' // eslint-disable-line

const path = require('path')

const { watch, chrome, firefox, coverage } = require('minimist')(process.argv.slice(2))

// eslint-disable-next-line
console.info(`Usage:
  --chrome    open in chrome
  --firefox   open in firefox
  --watch     keep alive and re-run on change
  --coverage  generate coverage report

  e.g. "npm test -- --chrome --watch"
`)

const browsers = []
if (chrome) {
  browsers.push('_Chrome')
}
if (firefox) {
  browsers.push('_Firefox')
}

const reporters = ['dots']
if (coverage) {
  reporters.push('coverage')
}

const preLoaders = [
  {
    test: /\.js$/,
    exclude: [
      path.resolve('node_modules')
    ],
    loader: 'babel',
    query: {
      cacheDirectory: true,
    }
  }
]
if (coverage) {
  preLoaders[0].exclude.push(path.resolve('dist'))
  preLoaders.push({
    test: /\.js$/,
    include: path.resolve('dist'),
    loader: 'isparta'
  })
}

module.exports = function(config) {
  config.set({
    basePath: '',

    frameworks: ['tap'],

    files: ['test.js'],

    preprocessors: {
      'test.js': 'webpack'
    },

    browsers,

    customLaunchers: {
      _Chrome: {
        base: 'Chrome',
        flags: ['--incognito']
      },
      _Firefox: {
        base: 'Firefox',
        flags: ['-private']
      },
    },

    autoWatch: watch,

    singleRun: !watch,

    reporters,

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
        preLoaders
      },

      isparta: {
        embedSource: true,
        noAutoWrap: true
      }
    },

    webpackMiddleware: {
      noInfo: true
    }
  })
}
