'use strict'

const path = require('path')
const { gzip } = require('zlib')
const execa = require('execa')
let _; const { each, padEnd, padStart, round, kebabCase } = _ = require('lodash')
const { green } = require('chalk')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')

const { LERNA_PACKAGE_NAME } = process.env
const PACKAGE_PATH = process.cwd()
const pkg = require(path.join(PACKAGE_PATH, 'package.json'))

const cache = {}

exports.build = function* (task) {
  console.log(`🚀 Building ${LERNA_PACKAGE_NAME}`)

  yield task.clear(pkg.files)
  yield task.serial(['transpile', 'bundle'])
}

exports.transpile = function* (task) {
  yield execa('../../node_modules/.bin/tsc', { stdio: 'inherit' })
}

exports.bundle = function* (task) {
  const dist = path.join(process.cwd(), path.dirname(pkg.main))
  const bundle = path.basename(pkg.main)
  
  yield task
    .source(path.resolve(process.cwd(), pkg.module))
    .rollup({
      cache: cache.bundle,
      external: ['knockout'],
      plugins: [
        nodeResolve({
          preferBuiltins: false
        }),
        commonjs()
      ],
      output: {
        file: `${bundle}.js`,
        format: 'umd',
        globals: {
          knockout: 'ko'
        },
        name: pkg.global
      }
    })
    .target(dist)

    .uglify()
    .rename({ suffix: '.min' })
    .target(dist)
}

exports.stats = function* (task) {
  const stats = [
    yield getModuleStats(task),
    ...(yield getBundleStats(task))
  ]

  const border = '-------------------------------------------------------------'
  const padNameWidth = 'knockout-contrib-router.min.js'.length + 3
  const padUncompressedWidth = '~XXXkb'.length + 3
  const padRightWidth = border.length - 4 - padNameWidth - padUncompressedWidth
  console.log(green(border)) // eslint-disable-line no-console
  _(stats)
    .sortBy(([name]) => name)
    .each(([name, raw, gzipped]) =>
      console.log(green(  // eslint-disable-line no-console
        '|',
        (
          padEnd(name, padNameWidth) +
          padStart(`~${raw}kb`, padUncompressedWidth) +
          padStart(`~${gzipped}kb gzipped`, padRightWidth)
        ),
        '|')))
  console.log(green(border))  // eslint-disable-line no-console
}

exports.meta = function* (task) {
  yield task
    .source(path.join(__dirname, 'packages/*/.meta'))
    .run({ every: true }, function * (metapackage) {
      const metapackageName = path.basename(metapackage.dir)

      console.log(`🔗  Generating metapackage ${metapackageName}`)

      yield task
        .source(path.join(__dirname, `packages/${metapackageName}.*`))
        .run({ every: false }, function * (packages) {
          this._.files = yield generateMetaFiles(metapackage, packages)
        })
        .target(path.join(__dirname, 'packages'))
    })
}
  
async function generateMetaFiles(metapackage, packages) {
  const metapackageName = path.basename(metapackage.dir)
  const metapackagePkgId = `@profiscience/knockout-contrib-${kebabCase(metapackageName)}`
  const exportType = metapackage.data.toString('utf8')
  const files = []
  const distFiles = []
  let index = ''
  let readme = `# ${metapackagePkgId}\n\n`
  readme += `This is a metapackage including all \`${metapackagePkgId}-*\` packages\n\n`
  readme += '### Contents\n'

  packages.forEach((p) => {
    const submoduleName = p.base.replace(metapackageName + '.', '')
    const { name: submodulePkgId } = require(path.join(p.dir, p.base, 'package.json'))

    if (exportType === 'exports') {
      index += `export { default as ${submoduleName} } from '${submodulePkgId}'\n`, ''
    } else if (exportType === 'global') {
      index += `import \'./${submoduleName}\'\n`
      distFiles.push(`${submoduleName}.js`, `${submoduleName}.d.ts`)
      files.push({
        dir: metapackage.dir,
        data: Buffer.from(`import ${submodulePkgId}\n`),
        base: `${submoduleName}.ts`
      })
    } else {
      throw new Error('🔥  invalid keyword in .meta')
    }

    readme += `- [${submoduleName}](../${p.base})\n`
  })

  distFiles.push('index.js', 'index.d.ts')
  files.push({
    dir: metapackage.dir,
    data: Buffer.from(index),
    base: 'index.ts'
  })

  const pkg = Object.assign(require(path.join(metapackage.dir, 'package.json')), {
    name: `@profiscience/knockout-contrib-${kebabCase(metapackage.base)}`,
    files: distFiles,
    dependencies: packages.reduce((accum, p) => {
      const { name, version } = require(path.join(p.dir, p.base, 'package.json'))
      return Object.assign(accum, {
        [name]: version
      })
    }, {})
  })
  distFiles.push(pkg.main)
  files.push({
    dir: metapackage.dir,
    data: Buffer.from(JSON.stringify(pkg, null, 2)),
    base: 'package.json'
  })

  const tsconfig = {
    compilerOptions: {
      moduleResolution: 'node',
      target: 'es5',
      module: 'es2015',
      declaration: true,
      sourceMap: true,
      rootDir: './',
      baseUrl: './',
      outDir: './'
    },
    include: [
      '**/*'
    ],
    exclude: [
    ]
  }
  files.push({
    dir: metapackage.dir,
    data: Buffer.from(JSON.stringify(tsconfig, null, 2)),
    base: 'tsconfig.json'
  })
  
  readme += '\n### Usage\n\n'
  readme += '```javascript\n'
  if (exportType === 'global') {
    readme += '// import all\n'
    readme += `import '${metapackagePkgId}'\n\n`
    readme += '// import single\n'
    readme += `import '${metapackagePkgId}/${packages[0].base.replace(metapackageName + '.', '')}'\n`
  }
  readme += '```'

  files.push({
    dir: metapackage.dir,
    data: Buffer.from(readme),
    base: 'README.md'
  })

  console.log(metapackage.base, metapackage.dir, files)

  return files
}

async function getModuleStats(task) {
  let combined = ''
  await task
    .source(path.resolve(__dirname, 'packages/*/dist/*.js'))
    .run({ every: true }, function * ({ data }) { // eslint-disable-line require-yield
      combined += data
    })
  const kilobytes = round(Buffer.byteLength(combined, 'utf8') / 1000)
  const compressedKilobytes = await getGzippedSize(combined)
  return ['dist/*.js', kilobytes, compressedKilobytes]
}

async function getBundleStats(task) {
  const stats = []
  await task
    .source(path.resolve(__dirname, 'packages/*/knockout-contrib-*.js'))
    .run({ every: true }, function * ({ base: name, data }) {
      const kilobytes = round(Buffer.byteLength(data, 'utf8') / 1000)
      const compressedKilobytes = yield getGzippedSize(data)
      stats.push([name, kilobytes, compressedKilobytes])
    })
  return stats
}

async function getGzippedSize(raw) {
  return await new Promise((resolve) => gzip(raw, (_, gzipped) =>
    resolve(round(Buffer.byteLength(gzipped, 'utf8') / 1000))))
}