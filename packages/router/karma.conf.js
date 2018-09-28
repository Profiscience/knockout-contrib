#!/usr/bin/env node

'use strict'

const path = require('path')

const { TRAVIS, DEBUG } = process.env

const karmaPlugins = [
  require('karma-firefox-launcher'),
  require('karma-tap-pretty-reporter'),
  require('karma-tap'),
  require('karma-webpack')
]

const karmaReporters = ['tap-pretty']

if (TRAVIS) {
  karmaPlugins.push(require('karma-remap-istanbul'))
  karmaReporters.push('karma-remap-istanbul')
}

module.exports = (config) => {
  config.set({
    basePath: __dirname,

    plugins: karmaPlugins,

    frameworks: ['tap'],

    files: ['__tests__/index.js'],

    preprocessors: {
      '__tests__/index.js': 'webpack'
    },

    browsers: ['_Firefox'],

    browserConsoleLogOptions: {
      terminal: false
    },

    customLaunchers: {
      _Firefox: {
        base: 'Firefox',
        flags: ['-private']
      }
    },

    // to debug, comment out singleRun, and uncomment autoWatch
    singleRun: !DEBUG,
    autoWatch: DEBUG,

    reporters: karmaReporters,

    tapReporter: {
      // prettify: require('tap-diff')
    },

    remapIstanbulReporter: {
      reports: {
        lcovonly: 'coverage/lcov.info',
        html: 'coverage/html'
      }
    },

    webpack: {
      context: __dirname,
      mode: 'development',
      node: {
        fs: 'empty'
      },
      devtool: 'inline-source-map',
      module: {
        rules: [
          {
            test: /\.js$/,
            use: {
              loader: 'istanbul-instrumenter-loader',
              options: { esModules: true }
            },
            include: path.resolve('dist')
          }
        ]
      }
    }
  })
}
