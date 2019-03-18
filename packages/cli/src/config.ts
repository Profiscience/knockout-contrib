import * as fs from 'fs-extra'
import * as os from 'os'
import * as path from 'path'
import { merge } from 'lodash'
import * as webpack from 'webpack'
// @ts-ignore
import trueCasePathSync from 'true-case-path'

export const projectRoot = getProjectRoot()

class Config {
  public strict = true

  public tmp = getTmpDir()

  public entry!: { [k: string]: string }

  public outDir = path.join(projectRoot, 'dist')

  public binding = path.join(projectRoot, 'bindings')
  public components = path.join(projectRoot, 'components')
  public extenders = path.join(projectRoot, 'extenders')
  public filters = path.join(projectRoot, 'filters')
  public views = path.join(projectRoot, 'views')
  public styles = path.join(projectRoot, 'styles')
  public fonts = path.join(this.styles, 'fonts')
  public images = path.join(projectRoot, 'images')

  public devServer = {
    proxy: 'http://localhost/UniversitySite'
  }

  constructor() {
    try {
      const projectConfig =
        require(path.join(projectRoot, 'package.json')).ali || {}
      if (!projectConfig.entry) {
        projectConfig.entry = { app: path.join(projectRoot, 'index.ts') }
      }
      merge(this, projectConfig)
    } catch (e) {
      /* noop */
    }
  }
}

export default new Config()

function getTmpDir() {
  const tmpDir = path.join(os.tmpdir(), 'UniversitySiteBuild')
  fs.ensureDirSync(tmpDir)
  return trueCasePathSync(tmpDir)
}

function getProjectRoot() {
  let dir = process.cwd()

  do {
    try {
      const pkg = require(path.join(dir, './package.json'))
      if (
        pkg.ali ||
        pkg.dependencies['@ali/cli'] ||
        pkg.devDependencies['@ali/cli']
      ) {
        return dir
      }
    } catch (e) {
      // noop
    }
    dir = path.resolve(dir, '..')
  } while (dir !== path.resolve(dir, '..'))

  throw new Error(
    'Could not find Ali project root! Hint: Add `"ali": {}` to your package.json'
  )
}
