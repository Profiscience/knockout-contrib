import * as fs from 'fs'
import * as os from 'os'
import * as path from 'path'
import { mapValues } from 'lodash'
import * as webpack from 'webpack'
import TypeCheckerPlugin from 'fork-ts-checker-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ScriptExtPlugin from 'script-ext-html-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import NotificationPlugin from 'webpack-notifier'
import { generateAliAppEntry } from '../generate-entry'

const AVAILABLE_CPUS = Math.min(Math.max(os.cpus().length - 2, 2), 4)

const loaders = {
  cache: (cacheDirectory: string) => ({
    loader: 'cache-loader',
    options: {
      cacheDirectory
    }
  }),
  style: 'style-loader/useable',
  css: 'css-loader',
  postcss: 'postcss-loader',
  typescript: ({ compat }: { compat?: boolean }) => ({
    loader: 'ts-loader',
    options: {
      happyPackMode: true,
      transpileOnly: true,
      experimentalWatchApi: true,
      compilerOptions: {
        target: compat ? 'es5' : 'es2017'
      }
    }
  }),
  html: {
    loader: 'html-loader',
    options: {
      removeAttributeQuotes: false,
      minifyJS: false,
      ignoreCustomComments: [/^\s*\/?ko/],
      ignoreCustomFragments: [/{{[^}]+}}/]
    }
  },
  file: {
    loader: 'file-loader',
    options: {
      hash: 'md5',
      digest: 'hex',
      name: '[name].[ext]'
    }
  },
  image: {
    loader: 'image-webpack-loader',
    options: {
      bypassOnDebug: true
    }
  },
  thread: (workers: number, watch?: boolean) => ({
    loader: 'thread-loader',
    options: {
      workers,
      workerNodeArgs: ['--require', path.resolve(__dirname, '../perf')],
      workerParallelJobs: 20,
      poolParallelJobs: workers * 20,
      poolTimeout: watch ? Infinity : 2000
    }
  })
}

type MaybeArray<T> = T | T[]

export interface IWebpackConfigOptions {
  entry: { [k: string]: string }
  sourceDir: string
  outDir: string
  strict: boolean
  tsconfig: string
  bindings: MaybeArray<string>
  components: MaybeArray<string>
  extenders: MaybeArray<string>
  filters: MaybeArray<string>
  views: MaybeArray<string>
  compat?: boolean
  production?: boolean
  watch?: boolean
  profile?: boolean
  check?: boolean
}

export function createWebpackConfig({
  entry,
  sourceDir,
  outDir,
  strict,
  tsconfig,
  bindings,
  components,
  extenders,
  filters,
  views,
  production,
  watch,
  compat,
  profile,
  check
}: IWebpackConfigOptions): webpack.Configuration {
  Object.keys(entry).forEach((k) => {
    const v = entry[k] as string
    generateAliAppEntry({
      entry: v,
      strict,
      bindings,
      components,
      extenders,
      filters,
      views
    })
  })

  const config: webpack.Configuration = {
    mode: production ? 'production' : 'development',

    devtool: production || compat ? false : 'source-map',

    entry: mapValues(entry, (v) => {
      const files = [path.resolve(__dirname, '../../../../__apps', `${v}.js`)]
      if (compat) files.push('@ali/polyfill')
      // if (!production) files.push('@ali/debug')
      return files
    }),

    output: {
      path: outDir,
      filename: 'entry.[name].[hash].js',
      chunkFilename: 'chunk.[contentHash].js'
    },

    watch,

    module: {
      rules: [
        {
          // https://github.com/webpack/webpack/issues/6796
          test: /node_modules/,
          resolve: {
            mainFields: ['esnext', 'es2015', 'module', 'main']
          }
        },
        {
          test: /\.ts$/,
          use: [
            loaders.cache('.cache/ts'),
            loaders.thread(AVAILABLE_CPUS, watch),
            loaders.typescript({ compat })
          ]
        },
        {
          test: /\.css$/,
          use: [
            loaders.cache('.cache/css'),
            loaders.style,
            loaders.css,
            loaders.postcss
          ]
        },
        {
          test: /\.html$/,
          use: [loaders.html]
        },
        {
          test: /\.(woff|ttf|eot)$/,
          use: [loaders.file]
        },
        {
          test: /\.(jpe?g|png|gif|svg)$/,
          use: [loaders.file, loaders.image]
        }
      ]
    },

    optimization: {
      removeAvailableModules: production,
      removeEmptyChunks: production,
      splitChunks: production
        ? ({
            chunks: 'all',
            cacheGroups: {
              default: false,
              common: {
                name: 'common',
                priority: 1,
                minChunks: 2,
                chunks: 'initial',
                enforce: true,
                reuseExistingChunk: true
              },
              asyncCommon: {
                name: true,
                priority: 1,
                minChunks: 3,
                chunks: 'async',
                enforce: true,
                reuseExistingChunk: true
              },
              vendors: {
                priority: 2,
                test: /knockout|tslib|core-js/,
                chunks: 'initial',
                name: 'vendors',
                enforce: true
              }
            }
          } as any)
        : undefined
    },

    plugins: [
      new NotificationPlugin(),
      new webpack.DefinePlugin({
        DEBUG: !production,
        PRODUCTION: production
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: production,
        debug: !production,
        options: {
          resolve: {
            extensions: ['.js', '.ts']
          }
        }
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),

      new HtmlWebpackPlugin(
        fs.existsSync(path.join(sourceDir, 'index.html'))
          ? { template: path.join(sourceDir, 'index.html') }
          : undefined
      ),

      ...(production
        ? [
            new ScriptExtPlugin({
              defaultAttribute: 'defer',
              prefetch: {
                test: /\.js$/,
                chunks: 'async'
              },
              inline: {
                test: [/runtime/]
              }
            })
          ]
        : [
            // readable HMR output
            new webpack.NamedModulesPlugin()
          ])
    ],

    resolve: {
      alias: {
        knockout$: path.join(
          'knockout/build/output',
          production ? 'knockout-latest.js' : 'knockout-latest.debug.js'
        )
      },

      mainFields: compat
        ? ['module', 'main']
        : ['esnext', 'es2015', 'module', 'main'],

      modules: [
        /**
         * Enable resolving relative module names from project root
         *
         * i.e.
         * import 'utils/handy-dandy-screwdriver'
         * import 'components/my-awesome-component'
         */
        sourceDir,
        'node_modules'
      ],
      extensions: ['.js', '.ts', '.tsx']
    }
  }

  if (config.plugins && config.module) {
    // always true but alas, typescript
    if (check !== false) {
      config.plugins.push(
        new TypeCheckerPlugin({
          async: false,
          silent: true,
          checkSyntacticErrors: true,
          tsconfig,
          watch: [
            path.join(sourceDir, '**/*.ts'),
            path.join(sourceDir, '**/*.tsx')
          ],
          workers: 1
        })
      )
    }

    if (compat) {
      config.module.rules.unshift({
        test: /\.js$/,
        exclude: /node_modules/,
        use: [loaders.typescript({ compat })]
      })
    }

    if (profile) {
      config.plugins.push((new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'profile.html',
        defaultSizes: 'gzip',
        logLevel: 'silent'
      }) as unknown) as webpack.Plugin)
    }
  }

  return config
}
