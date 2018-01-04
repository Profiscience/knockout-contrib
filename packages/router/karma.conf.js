#!/usr/bin/env node

'use strict'

const nodeResolve = require('rollup-plugin-node-resolve')
const nodeBuiltins = require('rollup-plugin-node-builtins')
const nodeGlobals = require('rollup-plugin-node-globals')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const rollupIstanbul = require('rollup-plugin-istanbul')

const { TRAVIS, DEBUG } = process.env

const karmaPlugins = [
  require('karma-firefox-launcher'),
  require('karma-mocha-reporter'),
  require('karma-rollup-preprocessor'),
  require('karma-tap')
]

const karmaReporters = ['mocha']

const rollupPlugins = [
  json(),
  commonjs({
    namedExports: {
      knockout: [
        'applyBindings',
        'applyBindingsToNode',
        'bindingHandlers',
        'components',
        'observable',
        'pureComputed',
        'tasks',
        'unwrap'
      ]
    }
  }),
  nodeGlobals(),
  nodeBuiltins(),
  nodeResolve({
    preferBuiltins: true
  })
]

let cache

if (TRAVIS) {
  karmaPlugins.push(require('karma-remap-istanbul'))
  karmaReporters.push('karma-remap-istanbul')
  rollupPlugins.push(
    rollupIstanbul({
      include: [
        'dist/**/*'
      ]
    })
  )
}

module.exports = (config) => {
  config.set({
    basePath: __dirname,

    plugins: karmaPlugins,

    frameworks: ['tap'],

    files: [
      '__tests__/index.js'
    ],

    preprocessors: {
      '__tests__/index.js': 'rollup'
    },

    browsers: [
      '_Firefox'
    ],

    customLaunchers: {
      _Firefox: {
        base: 'Firefox',
        flags: ['-private']
      },
    },

    // to debug, comment out singleRun, and uncomment autoWatch
    singleRun: !DEBUG,
    autoWatch: !DEBUG,

    reporters: karmaReporters,

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