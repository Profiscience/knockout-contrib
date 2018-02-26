import * as path from 'path'
import { generateComponentsManifest } from './components'
import { generateViewsManifest } from './views'

export type KnockoutContribFrameworkWebpackPluginConfig = {
  context?: string
}

export class KnockoutContribFrameworkWebpackPlugin {
  constructor(private config: KnockoutContribFrameworkWebpackPluginConfig = {}) {
    if (!this.config.context) {
      this.config.context = path.resolve(__dirname, '../../../../../src')
    }
  }

  public apply(compiler: any) {
    compiler.hooks.beforeRun.tapPromise('knockout-contrib-framework', () => this.generateManifests())
    compiler.hooks.watchRun.tapPromise('knockout-contrib-framework', () => this.generateManifests())
  }

  private async generateManifests() {
    await Promise.all([
      generateComponentsManifest(this.config),
      generateViewsManifest(this.config)
    ])
  }
}
