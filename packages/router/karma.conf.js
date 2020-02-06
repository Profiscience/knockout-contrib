#!/usr/bin/env node

'use strict'

// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

const { DEBUG } = process.env

module.exports = (config) => {
  config.set({
    basePath: __dirname,

    plugins: [
      require('karma-firefox-launcher'),
      require('karma-tap-pretty-reporter'),
      require('karma-tap'),
      require('karma-webpack'),
      require('karma-remap-istanbul')
    ],

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

    reporters: ['tap-pretty', 'karma-remap-istanbul'],

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
    },

    webpackMiddleware: {}
  })
}
