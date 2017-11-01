import * as path from 'path'
import { camelCase, kebabCase } from 'lodash'
import 'taskr'

export default function * (task: taskr.Task) {
  this._.files = []

  yield task
    .source(path.join(__dirname, '../packages/*/.meta'))
    .run({ every: true }, function* (metapackage) {
      const metapackageName = path.basename(metapackage.dir)
      const packages = yield this.$.expand(path.join(__dirname, `../packages/${metapackageName}.*`))
      
      const files = yield generateMetaFiles(metapackage, packages)

      console.log(`\nGenerated metapackage ${metapackageName}`)
      files.forEach((f) => console.log(`- ${f.base}`))

      this._.files.push(...files)
    })
    .target(path.join(__dirname, '../packages'))
}
  
async function generateMetaFiles(metapackage, packages) {
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

  const gitignore = `*\n!.meta\n!package.json\n!README.md`

  const files = []

  const distFiles = [
    'index.js',
    'index.d.ts',
    `knockout-contrib-${kebabCase(metapackageName)}.js`
  ]

  const readme = {
    header: `# ${metapackageId}\n\nThis is a metapackage including all \`${metapackageId}-*\` packages`,
    contents: '\n\n### Contents',
    usage: '\n\n### Usage\n\n```javascript\n'
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
        index += `export { default as ${packageName} } from '${packageId}'\n`, ''  
        if (i === 0) {
          readme.usage += `// import single\nimport { ${camelCase(packageName)} } from '${metapackageId}'`
        }
        break
      case 'global':
        index += `import \'./${packageName}\'\n`
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
    main: `knockout-contrib-${kebabCase(metapackageName)}.js`,
    module: 'index.js',
    'js:next': 'index.js',
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
      data: Buffer.from(readme.header + readme.contents + readme.usage),
      base: 'README.md'
    },
    {
      dir: metapackage.dir,
      data: Buffer.from(JSON.stringify(pkg, null, 2)),
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