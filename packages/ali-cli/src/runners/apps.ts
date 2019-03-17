import { BuildScopes } from '../scopes'
import { TaskRunner } from '../task-runner'
import { runWebpack } from '../webpack'

interface ISPABuildOptions {
  production?: boolean
  watch?: boolean
  compat?: boolean
  profile?: boolean
  verbose?: boolean
  scope?: BuildScopes
  check?: boolean
}

export class SPABuildRunner extends TaskRunner {
  constructor(opts: ISPABuildOptions) {
    super([
      {
        title: 'Apps',
        task: () =>
          runWebpack(
            {
              watch: opts.watch,
              compat: opts.compat,
              production: opts.production,
              profile: opts.profile,
              scope: opts.scope,
              check: opts.check
            },
            opts.verbose
          )
      }
    ])
  }
}
