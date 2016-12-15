'use strict' // eslint-disable-line

const webpack = require('webpack')

module.exports = [
  makeConfig(),
  makeConfig({ minify: true })
]

function makeConfig(o) {
  const minify = o ? o.minify : false
  return {
    entry: './src/index.js',

    output: {
      path: 'dist',
      filename: minify ? 'ko-querystring.min.js' : 'ko-querystring.js',
      library:  'ko-querystring',
      libraryTarget: 'umd'
    },

    module: {
      loaders: [
        {
          test: /\.js$/,
          exclude: /(node_modules)/,
          loader: 'babel'
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

    plugins: minify
      ? [
          new webpack.optimize.DedupePlugin(),
          new webpack.optimize.UglifyJsPlugin()
        ]
      : []
  }
}
