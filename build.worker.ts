/* tslint:disable:no-console */

import * as fs from 'fs-extra'
import * as path from 'path'
import chalk from 'chalk'
import * as babel from 'babel-core'
import * as ts from 'typescript'

const builds: { [k: string]: babel.TransformOptions | false } = {
  default: {
    presets: [['env', { modules: false }]],
    plugins: ['transform-runtime']
  },
  esnext: false,
  node: { presets: [['env', { targets: { node: 'current' } }]] }
}

type FileMeta = {
  pkgName: string
  relativeFilePath: string
  pkgDir: string
  outDir: string
  outFilename: string
  outFd: string
  mapFilename: string
  mapSource: string
}

function parseFd(fd: string): FileMeta {
  const baseDir = path.resolve(__dirname, 'packages')
  const [pkgName, ...fileSegments] = fd
    .replace(baseDir, '')
    .replace(/^[\\\/]/, '') // remove leading slash
    .split(/[\\\/]/) // split on all remaining slashes (must support both forward and back b/c windows)
  const pkgDir = path.join(__dirname, 'packages', pkgName)
  const outDir = path.join(pkgDir, 'dist')
  const hasExplicitSrcDir = fileSegments[0] === 'src'
  const relativeFilePath = path.join(
    ...(hasExplicitSrcDir ? fileSegments.slice(1) : fileSegments)
  )
  const outFilename = path.join(
    path.dirname(relativeFilePath),
    path.basename(relativeFilePath, path.extname(relativeFilePath)) + '.js'
  )
  const outFd = path.join(outDir, outFilename)
  const mapFilename =
    path.basename(relativeFilePath, path.extname(relativeFilePath)) + '.js.map'
  const mapSource = path.relative(path.join(outDir, relativeFilePath), fd)
  return {
    pkgName,
    relativeFilePath,
    pkgDir,
    outDir,
    outFilename,
    outFd,
    mapFilename,
    mapSource
  }
}

function fixSourcemapMapping(meta: FileMeta, output: ts.TranspileOutput) {
  return {
    code: output.outputText.replace(
      'sourceMappingURL=module.js.map',
      `sourceMappingURL=${meta.mapFilename}`
    ),
    map: {
      ...JSON.parse(output.sourceMapText as string),
      file: meta.mapFilename,
      sources: [meta.mapSource]
    }
  }
}

async function transpileTarget(
  meta: FileMeta,
  code: string,
  map: any,
  target: string
) {
  const dest = path.join(meta.outDir, target, meta.outFilename)
  const babelConfig = builds[target]
  if (babelConfig) {
    const result = babel.transform(code, {
      inputSourceMap: map,
      ...babelConfig
    })
    code = result.code as string
    map = result.map
  }
  await Promise.all([
    fs.outputFile(dest, code),
    fs.outputFile(dest + '.map', JSON.stringify(map))
  ])
}

async function transpileFile(fd: string) {
  const sourceCode = (await fs.readFile(fd)).toString()
  const meta = parseFd(fd)
  const tscResult = ts.transpileModule(sourceCode, require('./tsconfig.json'))
  const { code, map } = fixSourcemapMapping(meta, tscResult)
  await Promise.all(
    Object.keys(builds).map((t) => transpileTarget(meta, code, map, t))
  )
}

process.on('message', async ({ file }) => {
  try {
    await transpileFile(file)
    if (process.send) process.send({ file })
  } catch (err) {
    console.error(chalk.red('\n[build.worker]: Error in', file, '\n'))
    console.error(
      err.message
        .split('\n')
        .map((l: string) => chalk`\t{red ${l}}`)
        .join('\n'),
      '\n'
    )
    if (err.codeFrame) console.error(err.codeFrame)
    if (process.send) process.send({ file, hasErrors: true })
  }
})
