import * as path from 'path'
import * as fs from 'fs-extra'
import { flatMap, map } from 'lodash'
import * as eol from 'eol'
// @ts-ignore
import { parse as parseYarnLockfile } from '@yarnpkg/lockfile'

export async function getDepsRecursive(
  projectRoot: string,
  packages: string[]
) {
  const lockfileRaw = await fs.readFile(
    path.join(projectRoot, 'yarn.lock'),
    'utf8'
  )
  const lockfile = parseYarnLockfile(eol.lf(lockfileRaw.toString()))
  const pkg = require(path.join(projectRoot, 'package.json'))
  const packagesAtVersion = map(packages, (d) => {
    if (d.indexOf('/') > -1) {
      d = d.split('/')[0]
    }
    return `${d}@${pkg.dependencies[d]}`
  })
  return _getDepsRecursive(packagesAtVersion, lockfile)
}

function _getDepsRecursive(
  packageKeys: string[],
  lockfile: { [key: string]: any }
): string[] {
  return [
    ...packageKeys,
    ...flatMap(packageKeys, (p) => {
      // napa deps & buffer (from ?)
      if (!lockfile[p]) {
        return []
      }
      return _getDepsRecursive(
        map(lockfile[p].dependencies, (v, d) => `${d}@${v}`),
        lockfile
      )
    })
  ]
}
