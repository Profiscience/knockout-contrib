import * as fs from 'fs-extra'
import * as os from 'os'
import * as path from 'path'
import { merge } from 'lodash'
import * as trueCasePathSync from 'true-case-path'

class Config {
  public tmp = getTmpDir()

  public devServer = {
    proxy: 'http://localhost/UniversitySite'
  }

  constructor() {
    try {
      const local = require('../../config.json') // tslint:disable-line:no-var-requires
      merge(this, local)
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
