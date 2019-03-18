import * as path from 'path'
import { pick } from 'lodash'
import { CommandModule, Options } from 'yargs'
import config, { projectRoot } from '../config'
import { DevServerRunner } from '../runners/server'

type DevServerOption =
  | 'compat'
  | 'port'
  | 'proxy'
  | 'public'
  | 'verbose'
  | 'entries'
  | 'check'

export type DevServerOptions = { [key in DevServerOption]: any }

const options: { [key in DevServerOption]: Options } = {
  compat: {
    describe: 'transpile to ES5 for legacy browser support',
    boolean: true
  },
  port: {
    default: 8080
  },
  proxy: {
    describe: 'url for proxying unresolved requests (api, legacy, etc...)',
    default: config.devServer.proxy
  },
  public: {
    describe:
      'bind host to 0.0.0.0 instead of localhost so dev server is accessible on LAN',
    boolean: true
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

export const serveCommand: CommandModule<{}, DevServerOptions> = {
  command: 'serve',
  describe: 'start development server',
  builder: (yargs) => yargs.options(options),
  async handler(argv: DevServerOptions) {
    const server = new DevServerRunner({
      ...argv,
      entry:
        argv.entries && argv.entries.length > 0
          ? pick(config.entry, argv.entries)
          : config.entry,
      outDir: config.outDir,
      strict: config.strict,
      tsconfig: path.join(projectRoot, 'tsconfig.json'),
      bindings: config.binding,
      components: config.components,
      extenders: config.extenders,
      filters: config.filters,
      views: config.views
    })
    await server.run()
  }
}
