import * as path from 'path'
import config from './config'

const root = path.resolve(__dirname, '../../../')

function fromRoot(...fds) {
  return path.join(root, ...fds)
}

export default {
  root,

  fromRoot,

  client: {
    dist: fromRoot('SupportSite/_dist')
  },

  tmp: path.resolve(root, path.normalize(config.tmp))
}
