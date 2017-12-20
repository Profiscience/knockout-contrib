'use strict'

const path = require('path')
const { camelCase, kebabCase } = require('lodash')

module.exports = function * (task) {
  this._.files = []

  yield task
    .source(path.join(__dirname, '../packages/*/.meta'))
    .run({ every: true }, function* (metapackage) {
      /* eslint-disable no-invalid-this, no-console */
      const metapackageName = path.basename(metapackage.dir)
      const packages = yield this.$.expand(path.join(__dirname, `../packages/${metapackageName}.*`))

      const files = generateMetaFiles(metapackage, packages)

      console.log(`🔗  Generated ${metapackageName} metapackage`)
      // files.forEach((f) => console.log(`- ${f.base}`))

      this._.files.push(...files)
    })
    .target(path.join(__dirname, '../packages'))
}

function generateMetaFiles(metapackage, packages) {
  const metapackageName = path.basename(metapackage.dir)
  const metapackageId = `@profiscience/knockout-contrib-${kebabCase(metapackageName)}`
  const exportType = metapackage.data.toString('utf8')

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

  const gitignore = '*\n!.meta\n!package.json\n!README.md'

  const files = []

  const distFiles = [
    'index.js',
    'index.d.ts'
  ]

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
    readme.usage += `// import all\nimport * as ${camelCase(metapackageName)} from '${metapackageId}'\n\n`
    break
  case 'global':
    readme.usage += `// import all\nimport '${metapackageId}'\n\n`
    break
  default:
    throw new Error('🔥  invalid keyword in .meta')
  }

  packages.forEach((p, i) => {
    const packageName = p.split(metapackageName + '.')[1]
    const { name: packageId } = require(path.join(p, 'package.json'))

    readme.contents += `\n- [${packageName}](../${metapackageName}.${packageName})`

    switch (exportType) {
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
        data: Buffer.from(`import '${packageId}'\n`),
        base: `${packageName}.ts`
      })
      if (i === 0) {
        readme.usage += `// import single\nimport '${metapackageId}/${packageName}'`
      }
      break
    }
  })

  readme.usage += '\n```'

  const pkg = Object.assign(require(path.join(metapackage.dir, 'package.json')), {
    name: metapackageId,
    files: distFiles,
    module: 'index.js',
    'jsnext:main': 'index.js',
    typings: 'index.d.ts',
    dependencies: packages.reduce((accum, p) => {
      const { name, version } = require(path.join(p, 'package.json'))
      return Object.assign(accum, {
        [name]: version
      })
    }, {})
  })

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