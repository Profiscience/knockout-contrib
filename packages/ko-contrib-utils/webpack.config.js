'use strict' // eslint-disable-line

const webpack = require('webpack')

module.exports = [
  makeConfig(),
  makeConfig({ minify: true })
]

function makeConfig({ minify } = {}) {
  return {
    entry: './src/index.js',

    output: {
      path: 'dist',
      filename: minify ? 'ko-contrib-utils.min.js' : 'ko-contrib-utils.js',
      library:  'ko-contrib-utils',
      libraryTarget: 'umd'
    },

    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          loader: 'babel',
          query: {
            cacheDirectory: true,
            plugins: ['transform-es2015-modules-commonjs']
          }
        }
      ]
    },

    externals: {
      'knockout': {
        root: 'ko',
        commonjs: 'knockout',
        commonjs2: 'knockout',
        amd: 'knockout'
      }
    },

    devtool: 'source-map',

    plugins: minify
      ? [
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.UglifyJsPlugin()
        ]
      : []
  }
}
