#!/usr/bin/env node

'use strict'

const { TRAVIS, DEBUG } = process.env

const karmaPlugins = [
  require('karma-firefox-launcher'),
  require('karma-tap-pretty-reporter'),
  require('karma-rollup-preprocessor'),
  require('karma-tap')
]

const karmaReporters = ['tap-pretty']

const rollupPlugins = [
  require('rollup-plugin-json')(),
  require('rollup-plugin-commonjs')({
    namedExports: {
      knockout: [
        'applyBindings',
        'applyBindingsToNode',
        'bindingEvent',
        'bindingHandlers',
        'components',
        'observable',
        'pureComputed',
        'tasks',
        'unwrap'
      ]
    }
  }),
  require('rollup-plugin-node-globals')(),
  require('rollup-plugin-node-builtins')(),
  require('rollup-plugin-node-resolve')({
    preferBuiltins: true
  })
]

let cache

if (TRAVIS) {
  karmaPlugins.push(require('karma-remap-istanbul'))
  karmaReporters.push('karma-remap-istanbul')
  rollupPlugins.push(
    require('rollup-plugin-istanbul')({
      include: ['dist/**/*']
    })
  )
}

module.exports = (config) => {
  config.set({
    basePath: __dirname,

    plugins: karmaPlugins,

    frameworks: ['tap'],

    files: ['__tests__/index.js'],

    preprocessors: {
      '__tests__/index.js': 'rollup'
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

    rollupPreprocessor: {
      treeshake: false,
      cache,
      plugins: rollupPlugins,
      output: {
        format: 'iife',
        sourcemap: 'inline'
      }
    },

    remapIstanbulReporter: {
      reports: {
        lcovonly: 'coverage/lcov.info',
        html: 'coverage/html'
      }
    }
  })
}
