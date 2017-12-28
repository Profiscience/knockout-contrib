'use strict'

const fs = require('fs')
const os = require('os')
const path = require('path')
const { promisify } = require('util')
const globby = require('globby')
const express = require('express')
const webpack = require('webpack')
const middleware = require('webpack-dev-middleware')
const HappyPack = require('happypack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

let server

module.exports = {
  *'serve:examples'(task) {
    server = yield startExampleDevServer()
    yield task.watch('packages/*/examples/index.html', ['restart:examples'])
  },
  *'restart:examples'() {
    server.close()
    server = yield startExampleDevServer()
  },
  *'build:examples'() {
    yield buildExamples()
  }
}

async function startExampleDevServer() {
  const config = await getWebpackConfig()
  const compiler = webpack(config)
  const app = express()
  console.log('\nStarting dev server at http://localhost:3000\n') // eslint-disable-line no-console
  return app
    .use(middleware(compiler, {
      // lazy: true,
      publicPath: config.output.publicPath
    }))
    .listen(3000)
}

async function buildExamples() {
  const config = await getWebpackConfig()
  webpack(config, (err, stats) => {
    if (err || stats.hasErrors()) {
      console.error(stats.compilation.errors) // eslint-disable-line no-console
    }
  })
}

async function getEntryFiles() {
  const exampleEntries = await globby('packages/*/examples/index.ts')
  return exampleEntries.reduce((entryFiles, file) => {
    const name = file.match(/packages\/([^/]+)/)[1]
    return Object.assign({ [name]: path.resolve(__dirname, '..', file) }, entryFiles)
  }, {})
}

async function getAliases() {
  const packages = await globby('packages/*', { nodir: false })
  return packages.reduce((aliases, pkg) => {
    const tsconfig = require(path.resolve(pkg, 'tsconfig.json'))
    const { name } = require(path.resolve(pkg, 'package.json'))
    const distDir = path.resolve(pkg, tsconfig.compilerOptions.outDir)
    return Object.assign({ [name]: distDir }, aliases)
  }, {})
}

async function getWebpackConfig() {
  const root = path.resolve(__dirname, '..')
  const entryFiles = await getEntryFiles()
  const entryFileContents = {}

  await Promise.all(
    Object
      .keys(entryFiles)
      .map(async (f) => {
        const partial = await promisify(fs.readFile)(path.resolve(__dirname, '../packages', f, 'examples/index.html'))
        entryFileContents[f] = partial.toString()
      })
  )

  return {
    context: root,
    entry: entryFiles,
    output: {
      publicPath: '/',
      path: path.resolve(root, 'examples/dist'),
      filename: '[name].entry.js',
      chunkFilename: '[id].js'
    },
    devtool: 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.[jt]s$/,
          loader: 'happypack/loader?id=ts',
          exclude: [
            path.resolve(__dirname, '../node_modules')
          ]
        },
        {
          test: /\.html$/,
          loader: 'html-loader'
        },
        require('../packages/components/webpack')
      ]
    },
    resolve: {
      alias: await getAliases(),
      extensions: [
        '.js',
        '.ts',
        '.tsx'
      ]
    },
    plugins: [
      new HappyPack({
        id: 'ts',
        threads: os.cpus().length - 2,
        loaders: [
          {
            path: 'ts-loader',
            query: {
              happyPackMode: true
            }
          }
        ]
      }),
      new HtmlWebpackPlugin({
        template: 'examples/index.ejs',
        filename: 'index.html',
        inject: false,
        packages: Object.keys(entryFiles)
      }),
      ...Object
        .keys(entryFiles)
        .map((entry) =>
          new HtmlWebpackPlugin({
            template: 'examples/package.ejs',
            filename: `${entry}/index.html`,
            chunks: [entry],
            content: entryFileContents[entry]
          })
        )
    ]
  }
}