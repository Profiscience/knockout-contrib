import * as fs from 'fs'
import * as path from 'path'
import { promisify as pify } from 'util'

const readdir = pify(fs.readdir)
const readFile = pify(fs.readFile)
const writeFile = pify(fs.writeFile)
const mkdir = pify(fs.mkdir)

// ../knockout-contrib-framework
// ../../@profiscience
// ../../../node_modules
// ../../../../
const src = path.resolve(__dirname, '../../../../src/views')
const outDir = path.resolve(__dirname, '../build')
const outFile = path.join(outDir, 'VIEW_MANIFEST.js')

export async function generateViewsManifest() {
  const views = (await readdir(src)).filter((f) => path.extname(f) === '')
  const code = generateManifest(views)
  if (!fs.existsSync(outDir)) {
    await mkdir(path.resolve(__dirname, '../build'))
  } else if (fs.existsSync(outFile) && Buffer.from(code).equals(await readFile(outFile))) {
    return
  }
  await writeFile(outFile, code)
}

function generateManifest(components: string[]) {
  return components
    .map((c) => `export { default as ${c} } from '${path.resolve(src, c)}'`)
    .join('\n')
}
