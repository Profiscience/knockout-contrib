import * as fs from 'fs'
import * as path from 'path'
import { promisify as pify } from 'util'
import { KnockoutContribFrameworkWebpackPluginConfig } from 'support/webpack'

const readdir = pify(fs.readdir)
const readFile = pify(fs.readFile)
const writeFile = pify(fs.writeFile)
const mkdir = pify(fs.mkdir)

const outDir = path.resolve(__dirname, '../../build')
const outFile = path.join(outDir, 'VIEW_MANIFEST.js')

export async function generateViewsManifest(config: KnockoutContribFrameworkWebpackPluginConfig) {
  const src = path.join(config.context, 'views')
  const views = (await readdir(src)).filter((f) => path.extname(f) === '')
  const code = generateManifest(src, views)
  if (!fs.existsSync(outDir)) {
    await mkdir(path.resolve(__dirname, '../../build'))
  } else if (fs.existsSync(outFile) && Buffer.from(code).equals(await readFile(outFile))) {
    return
  }
  await writeFile(outFile, code)
}

function generateManifest(src: string, components: string[]) {
  return components
    .map((c) => `export { default as ${c} } from '${path.resolve(src, c)}'`)
    .join('\n')
}
