import * as fs from 'fs-extra'
import * as path from 'path'
import { castArray } from 'lodash'
import * as webpack from 'webpack'
import { buildStyles, buildApps } from '@ali/build'
import config, { projectRoot } from '../config'
import { TaskRunner } from '../task-runner'

interface ISPABuildOptions {
  entry: webpack.Entry
  production?: boolean
  watch?: boolean
  compat?: boolean
  profile?: boolean
  verbose?: boolean
  json?: string
  check?: boolean
}

export class BuildRunner extends TaskRunner {
  constructor(opts: ISPABuildOptions) {
    const hasFonts = fs.existsSync(config.fonts)
    const hasImages = fs.existsSync(config.images)
    super(
      [
        {
          title: 'Apps',
          task: () =>
            buildApps({
              context: projectRoot,
              entry: opts.entry,
              outDir: config.outDir,
              strict: config.strict,
              bindings: config.binding,
              components: config.components,
              extenders: config.extenders,
              filters: config.filters,
              views: config.views,
              watch: opts.watch,
              compat: opts.compat,
              production: opts.production,
              profile: opts.profile,
              check: opts.check
            })
        },
        {
          title: 'Shared Styles',
          skip: () => {
            if (!fs.existsSync(config.styles)) return 'No styles directory'
          },
          task: () =>
            buildStyles({
              outDir: config.outDir,
              production: opts.production,
              watch: opts.watch,
              files: castArray(config.styles),
              cacheId: 'shared_styles',
              outFile: 'styles.shared.css'
            })
        },
        {
          title: 'Assets',
          skip: () => {
            if (!hasFonts && !hasImages) return 'No assets'
          },
          task: () =>
            Promise.all([
              hasFonts
                ? fs.copy(config.fonts, path.join(config.outDir, 'fonts'), {
                    overwrite: true
                  })
                : Promise.resolve(),
              hasImages
                ? fs.copy(config.images, path.join(config.outDir, 'images'), {
                    overwrite: true
                  })
                : Promise.resolve()
            ]).then(() => {
              // noop
            })
        }
      ],
      {
        concurrent: true,
        verbose: opts.verbose,
        json: opts.json
      }
    )
  }
}
