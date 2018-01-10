'use strict'

const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const { kebabCase } = require('lodash')

exports.meta = function * (task) {
  this._.files = []

  /**
   * Generate metapackages
   */
  yield task
    .source(path.join(__dirname, '../packages/*/.meta'))
    .run({ every: true }, function* (metapackage) {
      /* eslint-disable no-invalid-this, no-console */
      const metapackageName = path.basename(metapackage.dir)
      const packages = yield this.$.expand(path.join(__dirname, `../packages/${metapackageName}.*`))
      const files = yield generateMetaFiles(metapackage, packages)

      console.log(`🔗  Generated ${metapackageName} metapackage`)

      this._.files.push(...files)
    })
    .target(path.join(__dirname, '../packages'))

  /**
   * Add `build`, `test` task to each package
   */
  yield task
    .source(path.join(__dirname, '../packages/*/package.json'))
    .run({ every: true }, function* ({ dir, data, base }) { // eslint-disable-line require-yield
      const pkgJson = JSON.parse(data.toString())
      const isComponent = pkgJson.name.indexOf('components-') > -1
      if (!pkgJson.scripts) {
        pkgJson.scripts = {}
      }
      pkgJson.scripts = Object.assign({
        build: '../../node_modules/.bin/taskr build -d ../..',
        test: 'DIR=$PWD; cd ../..; yarn test $DIR'
      }, pkgJson.scripts)
      if (isComponent) {
        pkgJson.scripts.watch = '../../node_modules/.bin/taskr watch -d ../..'
      }
      this._.files.push({
        dir,
        data: Buffer.from(JSON.stringify(pkgJson, null, 2) + '\n'),
        base
      })
    })
    .target(path.join(__dirname, '../packages'))
}

async function generateMetaFiles(metapackage, packages) {
  const metapackageName = path.basename(metapackage.dir)
  const metapackageId = `@profiscience/knockout-contrib-${kebabCase(metapackageName)}`
  const exportType = metapackage.data.toString('utf8')

  const lib = new Set()
  const files = []

  const distFiles = [
    'index.js',
    'index.d.ts'
  ]

  const gitignore = '*\n!.meta\n!package.json\n!README.md'
  const contents = []

  let index = ''

  packages.forEach((p, i) => {
    const packageName = p.split(metapackageName + '.')[1]
    const { name: packageId } = require(path.join(p, 'package.json'))
    const requiredLibs = require(path.join(p, 'tsconfig.json')).compilerOptions.lib || []

    requiredLibs.forEach((l) => lib.add(l))

    contents.push(`- [${packageName}](../${metapackageName}.${packageName})`)

    switch (exportType) {
    case 'named exports':
      index += `export * from '${packageId}'\n`
      break
    case 'exports':
      index += `export { default as ${packageName} } from '${packageId}'\n`
      break
    case 'global':
      index += `import './${packageName}'\n`
      distFiles.push(`${packageName}.js`, `${packageName}.d.ts`)
      files.push({
        dir: metapackage.dir,
        data: Buffer.from(`import '${packageId}'\nexport * from '${packageId}'\n`),
        base: `${packageName}.ts`
      })
      break
    }
  })

  const readmeLines = (await promisify(fs.readFile)(path.join(metapackage.dir, 'README.md'))).toString().split('\n')
  const tocStart = readmeLines.indexOf('<!-- TOC -->')
  const tocEnd = readmeLines.indexOf('<!-- /TOC -->')
  readmeLines.splice(tocStart + 1, tocEnd - tocStart - 1, '### Contents', ...contents)

  const pkg = require(path.join(metapackage.dir, 'package.json'))
  const existingDeps = Object.keys(pkg.dependencies).reduce((accum, k) => {
    if (!/@profiscience\/knockout-contrib/.test(k)) {
      accum[k] = pkg.dependencies[k]
    }
    return accum
  }, {})

  Object.assign(pkg, {
    name: metapackageId,
    files: distFiles,
    main: `dist/knockout-contrib-${kebabCase(metapackageName)}.js`,
    module: 'index.js',
    typings: 'index.d.ts',
    dependencies: packages.reduce((accum, p) => {
      const { name, version } = require(path.join(p, 'package.json'))
      return Object.assign(accum, {
        [name]: `^${version}`
      })
    }, existingDeps)
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
      outDir: './',
      jsx: 'react',
      jsxFactory: 'h'
    },
    include: [
      '**/*'
    ],
    exclude: [
    ]
  }
  if (lib.size > 0) {
    tsconfig.compilerOptions.lib = Array.from(lib)
  }

  files.push(
    {
      dir: metapackage.dir,
      data: Buffer.from(gitignore),
      base: '.gitignore'
    },
    {
      dir: metapackage.dir,
      data: Buffer.from(index),
      base: 'index.ts'
    },
    {
      dir: metapackage.dir,
      data: Buffer.from(readmeLines.join('\n')),
      base: 'README.md'
    },
    {
      dir: metapackage.dir,
      data: Buffer.from(JSON.stringify(pkg, null, 2) + '\n'),
      base: 'package.json'
    },
    {
      dir: metapackage.dir,
      data: Buffer.from(JSON.stringify(tsconfig, null, 2)),
      base: 'tsconfig.json'
    }
  )

  return files
}