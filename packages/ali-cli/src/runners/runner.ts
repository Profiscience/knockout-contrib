import * as fs from 'fs-extra'
import * as path from 'path'
import * as git from 'git-rev-sync'
import paths from '../paths'
import { TaskRunner } from '../task-runner'
import { buildStyles } from '../postcss'

interface ISPABuildOptions {
  production?: boolean
  watch?: boolean
  compat?: boolean
  profile?: boolean
  verbose?: boolean
  check?: boolean
}

export class BuildRunner extends TaskRunner {
  constructor(opts: ISPABuildOptions) {
    super(
      [
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
        },
        {
          title: 'Shared Styles',
          task: () =>
            buildStyles({
              production: opts.production,
              watch: opts.watch,
              files: [paths.styles],
              cacheId: 'shared_styles',
              outFile: 'styles.shared.css'
            })
        },
        {
          title: 'Assets',
          task: () =>
            Promise.all([
              fs.copy(paths.fonts, path.join(paths.dist, 'fonts'), {
                overwrite: true
              }),
              fs.copy(paths.images, path.join(paths.dist, 'images'), {
                overwrite: true
              })
            ])
        }
      ],
      {
        concurrent: true
      }
    )
  }
}
