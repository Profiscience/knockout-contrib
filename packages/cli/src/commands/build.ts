import * as path from 'path'
import { pick } from 'lodash'
import chalk from 'chalk'
import { CommandModule, Options } from 'yargs'
import config from '../config'
import { BuildRunner } from '../runners'

type BuildOption =
  | 'production'
  | 'watch'
  | 'compat'
  | 'verbose'
  | 'json'
  | 'profile'
  | 'entries'
  | 'check'

export type BuildOptions = { [key in BuildOption]?: any }

const options: { [key in BuildOption]: Options } = {
  production: {
    alias: 'p',
    describe: 'optimize for production',
    coerce: (v) => v === true || v === 'true'
  },
  watch: {
    alias: 'w',
    describe: 'watch for changes and rebuild',
    coerce: (v) => v === true || v === 'true'
  },
  compat: {
    describe: 'transpile to ES5 for legacy browser support',
    coerce: (v) => v === true || v === 'true'
  },
  verbose: {
    alias: 'v',
    describe: 'verbose logging, optionally pass a path to output log',
    coerce: (v) => {
      if (v === true || v === 'true') {
        return true
      }
      if (typeof v === 'string') {
        return path.resolve(process.cwd(), path.normalize(v))
      }
    }
  },
  json: {
    describe:
      'output in machine-readable format, optionally pass a path to output json',
    coerce: (v) => {
      if (v === true || v === 'true') {
        return true
      }
      if (typeof v === 'string') {
        return path.resolve(process.cwd(), path.normalize(v))
      }
    }
  },
  profile: {
    describe: 'generate build profile for optimizing bundles',
    boolean: true,
    coerce: (v) => v === true || v === 'true'
  },
  entries: {
    describe: 'limit the build scope for faster development',
    array: true,
    choices: Object.keys(config.entry),
    coerce: (vs: string[]) => vs.map((v) => v.toLowerCase())
  },
  check: {
    describe: 'Enable TypeScript type-checking',
    default: true,
    boolean: true,
    coerce: (v) => v === true || v === 'true'
  }
}

export const buildCommand: CommandModule<{}, BuildOptions> = {
  command: 'build',
  describe: 'build app(s)',
  builder: (yargs) => yargs.options(options),
  async handler(argv: BuildOptions) {
    if (argv.production) {
      process.env.NODE_ENV = 'production'
    }

    const tasks = new BuildRunner({
      ...argv,
      entry:
        argv.entries && argv.entries.length > 0
          ? pick(config.entry, argv.entries)
          : config.entry
    })

    if (argv.production && !argv.compat) {
      // tslint:disable-next-line:no-console
      console.warn(
        '--production used without --compat. This build will only work in modern browsers.'
      )
    }

    try {
      await tasks.run()
    } catch (e) {
      // tslint:disable:no-console
      console.error(`\n\n${chalk.red('Build failed')}`)

      if (!argv.verbose) {
        console.log(
          `\nYou may want to use the ${chalk.cyan(
            '--verbose'
          )} flag for more debugging output\n`
        )
      }

      process.exit(1)
    }
  }
}
