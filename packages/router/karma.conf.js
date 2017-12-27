#!/usr/bin/env node

'use strict'

const nodeResolve = require('rollup-plugin-node-resolve')
const nodeBuiltins = require('rollup-plugin-node-builtins')
const nodeGlobals = require('rollup-plugin-node-globals')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const rollupIstanbul = require('rollup-plugin-istanbul')

let cache

module.exports = (config) => {
  config.set({
    basePath: __dirname,

    plugins: [
      require('karma-firefox-launcher'),
      require('karma-mocha-reporter'),
      require('karma-remap-istanbul'),
      require('karma-rollup-preprocessor'),
      require('karma-tap')
    ],

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
    singleRun: true,
    // autoWatch: false,

    reporters: ['mocha', 'karma-remap-istanbul'],

    rollupPreprocessor: {
      treeshake: false,
      cache,
      plugins: [
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
        }),
        rollupIstanbul({
          include: [
            'dist/**/*'
          ]
        })
      ],
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