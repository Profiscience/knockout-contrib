import * as path from 'path'
import { CommandModule, Options } from 'yargs'
import config from '../lib/config'
import { BuildScopes, inAtLeastOneScope } from '../lib/scopes'
import { DevServerRunner } from '../lib/webpack/server'

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
    // see check below, you can combine with 'api', but can't use alone
    choices: Object.keys(BuildScopes).map((k) => BuildScopes[k]),
    coerce: (vs) => vs.map((v) => v.toLowerCase())
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
  builder: (yargs) =>
    yargs
      .options(options)
      .check((argv: any) =>
        inAtLeastOneScope(
          argv,
          BuildScopes.CLE,
          BuildScopes.Instructor,
          BuildScopes.Login,
          BuildScopes.Legacy
        )
      ),
  async handler(argv: DevServerOptions) {
    const server = new DevServerRunner(argv)
    await server.run()
  }
}
