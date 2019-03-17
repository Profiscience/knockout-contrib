import * as os from 'os'
import * as path from 'path'
import { mapValues } from 'lodash'
import * as webpack from 'webpack'
import TypeCheckerPlugin from 'fork-ts-checker-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import NotificationPlugin from 'webpack-notifier'

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
      workerNodeArgs: ['--require', path.resolve('../perf')],
      workerParallelJobs: 20,
      poolParallelJobs: workers * 20,
      poolTimeout: watch ? Infinity : 2000
    }
  })
}

export interface IWebpackConfigOptions {
  context: string
  entry: webpack.Entry
  outDir: string
  compat?: boolean
  production?: boolean
  watch?: boolean
  profile?: boolean
  check?: boolean
}

export function createWebpackConfig({
  context,
  entry,
  outDir,
  production,
  watch,
  compat,
  profile,
  check
}: IWebpackConfigOptions): webpack.Configuration {
  if (compat) {
    entry = mapValues(entry, (v) => ['@ali/polyfill', v]) as webpack.Entry
  }

  const config: webpack.Configuration = {
    context,

    mode: production ? 'production' : 'development',

    devtool: production || compat ? false : 'source-map',

    entry,

    output: {
      path: outDir,
      filename: 'entry.[name].[chunkHash].js',
      chunkFilename: 'chunk.[chunkHash].js'
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
            loaders.cache('ts'),
            loaders.thread(AVAILABLE_CPUS, watch),
            loaders.typescript({ compat })
          ]
        },
        {
          test: /\.css$/,
          use: [
            loaders.cache('css'),
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
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
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
        context,
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
          tsconfig: path.join(context, 'tsconfig.json'),
          watch: [
            path.join(context, '**/*.ts'),
            path.join(context, '**/*.tsx')
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
