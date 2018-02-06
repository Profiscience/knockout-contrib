import * as fs from 'fs'
import * as path from 'path'
import { promisify as pify } from 'util'

const readdir = pify(fs.readdir)
const writeFile = pify(fs.writeFile)
const mkdir = pify(fs.mkdir)

// ../knockout-contrib-framework
// ../../@profiscience
// ../../../node_modules
// ../../../../
const src = path.resolve(__dirname, '../../../../src/views')

export async function generateViewsManifest() {
  const views = (await readdir(src)).filter((f) => path.extname(f) === '')
  const code = generateManifest(views)
  if (!fs.existsSync(path.resolve(__dirname, '../build'))) await mkdir(path.resolve(__dirname, '../build'))
  await writeFile(path.resolve(__dirname, '../build/VIEW_MANIFEST.js'), code)
}

function generateManifest(components: string[]) {
  return components
    .map((c) => `export { default as ${c} } from '${path.resolve(src, c)}'`)
    .join('\n')
}
