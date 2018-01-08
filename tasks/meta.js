'use strict'

const path = require('path')
const { camelCase, kebabCase } = require('lodash')

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
      const files = generateMetaFiles(metapackage, packages)

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

function generateMetaFiles(metapackage, packages) {
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

  const readme = {
    header: [
      `# ${metapackageId}\n`,
      '[![Version][npm-version-shield]][npm]',
      '[![Dependency Status][david-dm-shield]][david-dm]',
      '[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]',
      '[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]',
      '[![Downloads][npm-stats-shield]][npm-stats]',
      `\nThis is a metapackage including all \`${metapackageId}-*\` packages`
    ].join('\n'),
    contents: '\n\n### Contents',
    usage: '\n\n### Usage\n\n```javascript\n',
    links: [
      `\n[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/${metapackageName}`,
      `[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/${metapackageName}`,

      `\n[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/${metapackageName}&type=peer`,
      `[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/${metapackageName}`,

      `\n[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/${metapackageName}&type=dev`,
      `[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/${metapackageName}`,

      `\n[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-${kebabCase(metapackageName)}`,
      `[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-${kebabCase(metapackageName)}.svg`,

      `\n[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-${kebabCase(metapackageName)}&author=&from=&to=`,
      `[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-${kebabCase(metapackageName)}.svg?maxAge=2592000`
    ].join('\n')
  }
  let index = ''

  switch (exportType) {
  case 'exports':
  case 'named exports':
    readme.usage += `// import all\nimport * as ${camelCase(metapackageName)} from '${metapackageId}'\n\n`
    break
  case 'global':
    readme.usage += `// import all\nimport '${metapackageId}'\n\n`
    break
  default:
    throw new Error(`🔥  invalid keyword in .meta ${exportType}`)
  }

  packages.forEach((p, i) => {
    const packageName = p.split(metapackageName + '.')[1]
    const { name: packageId } = require(path.join(p, 'package.json'))
    const requiredLibs = require(path.join(p, 'tsconfig.json')).compilerOptions.lib || []

    requiredLibs.forEach((l) => lib.add(l))

    readme.contents += `\n- [${packageName}](../${metapackageName}.${packageName})`

    switch (exportType) {
    case 'named exports':
      index += `export * from '${packageId}'\n`
      if (i === 0) {
        const n = metapackageName === 'router.plugins' ? packageName + 'Plugin' : packageName
        readme.usage += `// import single\nimport { ${camelCase(n)} } from '${metapackageId}'`
      }
      break
    case 'exports':
      index += `export { default as ${packageName} } from '${packageId}'\n`
      if (i === 0) {
        readme.usage += `// import single\nimport { ${camelCase(packageName)} } from '${metapackageId}'`
      }
      break
    case 'global':
      index += `import './${packageName}'\n`
      distFiles.push(`${packageName}.js`, `${packageName}.d.ts`)
      files.push({
        dir: metapackage.dir,
        data: Buffer.from(`import '${packageId}'\nexport * from '${packageId}'\n`),
        base: `${packageName}.ts`
      })
      if (i === 0) {
        readme.usage += `// import single\nimport '${metapackageId}/${packageName}'`
      }
      break
    }
  })

  readme.usage += '\n```'

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
        [name]: version
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
      data: Buffer.from(readme.header + readme.contents + readme.usage + '\n' + readme.links),
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