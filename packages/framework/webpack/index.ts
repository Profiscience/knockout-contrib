import { generateComponentsManifest } from './components'
import { generateViewsManifest } from './views'

export class KnockoutContribFrameworkWebpackPlugin {
  public apply(compiler: any) {
    compiler.plugin('before-run', async (_: any, cb: any) => {
      await Promise.all([
        generateComponentsManifest(),
        generateViewsManifest()
      ])
      cb()
    })
  }
}
