'use strict' // eslint-disable-line strict

const path = require('path')
const HappyPack = require('happypack')
const ForkTSCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = {
  context: __dirname,
  entry: {
    'hashbang': path.resolve(__dirname, './hashbang/index.js'),
    'lazy-loading': path.resolve(__dirname, './lazy-loading/index.js'),
    'loading-animation': path.resolve(__dirname, './loading-animation/index.js'),
    'mvc': path.resolve(__dirname, './mvc/index.js'),
    'path-binding': path.resolve(__dirname, './path-binding/index.js'),
    'simple-auth': path.resolve(__dirname, './simple-auth/index.js')
  },
  output: {
    publicPath: '/dist/',
    filename: '[name].js'
  },
  devServer: {
    contentBase: __dirname
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.[jt]s$/,
        loader: 'happypack/loader?id=ts',
        exclude: [
          path.resolve(__dirname, 'node_modules'),
          path.resolve(__dirname, '../node_modules')
        ]
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      }
    ]
  },
  resolve: {
    alias: {
      '@profiscience/knockout-contrib-router': path.resolve(__dirname, '../dist')
    },
    extensions: [
      '.js',
      '.ts'
    ]
  },
  plugins: [
    new HappyPack({
      id: 'ts',
      threads: ForkTSCheckerWebpackPlugin.TWO_CPUS_FREE,
      loaders: [
        {
          path: 'ts-loader',
          query: {
            happyPackMode: true
          }
        }
      ]
    }),
    new ForkTSCheckerWebpackPlugin({
      async: false,
      workers: 2
    })
  ]
}
