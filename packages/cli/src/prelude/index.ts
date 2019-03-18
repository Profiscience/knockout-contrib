import './node-version-check'
import { ensureNpmDeps } from './npm-deps'

const { argv } = process

export default (async () => {
  if (argv.indexOf('--no-install') < 0) {
    await ensureNpmDeps()
  }
})()
