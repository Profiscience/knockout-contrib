import { promises as fs } from 'fs'
import { camelCase, flatten } from 'lodash/fp'

type MaybeArray<T> = T | T[]

export type AliAppEntryConfig = {
  entry: string
  strict?: boolean
  bindings?: MaybeArray<string>
  components?: MaybeArray<string>
  extenders?: MaybeArray<string>
  filters?: MaybeArray<string>
  views?: MaybeArray<string>
}

export async function generateAliAppEntry(config: AliAppEntryConfig) {
  let source = ''

  // when "strict" is enabled (by default), these must be loaded explicitly in
  // route configs
  if (config.strict === false) {
    source += (await Promise.all([
      generateBindingRegistrationSourceCode(castArray(config.bindings)),
      generateComponentRegistrationSourceCode(castArray(config.components)),
      generateExtendersRegistrationSourceCode(castArray(config.extenders)),
      generateFiltersRegistrationSourceCode(castArray(config.filters))
    ])).join('\n\n')
  }

  // user-defined entry
  source += await `import '${config.entry}'`

  // views/routes must come after user-defined entry b/c additional plugins may
  // be registered because imports are hoisted and plugins are evaluated on
  // route construction
  source += await generateViewRegistrationSourceCode(castArray(config.views))

  return source
}

const castArray = (maybeArr: MaybeArray<any> = []) =>
  Array.isArray(maybeArr) ? maybeArr : [maybeArr]

const generateSimpleAssignmentSourceCode = (
  type: string,
  assignmentPoint: string
) => async (dirs: string[]) => {
  const names = flatten(await Promise.all(dirs.map((d) => fs.readdir(d))))
  return flatten(
    names.map((n) => {
      const varName = camelCase(n) + type
      return [
        `import ${varName} from './${n}'`,
        `${assignmentPoint}.${n} = ${varName}\n`
      ]
    })
  ).join('\n')
}

const generateBindingRegistrationSourceCode = generateSimpleAssignmentSourceCode(
  'Binding',
  'ko.bindingHandlers'
)
const generateExtendersRegistrationSourceCode = generateSimpleAssignmentSourceCode(
  'Extender',
  'ko.extenders'
)
const generateFiltersRegistrationSourceCode = generateSimpleAssignmentSourceCode(
  'Filter',
  'ko.filters'
)

async function generateComponentRegistrationSourceCode(dirs: string[]) {
  const componentNames = flatten(
    await Promise.all(dirs.map((d) => fs.readdir(d)))
  )
  return [
    `import { ComponentLoader } from '@ali/core'`,
    'ko.componentLoaders.unshift(',
    '  new ComponentLoader({',
    componentNames.map((n) => `    '${n}': import('./${n}')`).join(',\n'),
    '  })',
    ')'
  ].join('\n')
}

async function generateViewRegistrationSourceCode(dirs: string[]) {
  const viewNames = flatten(await Promise.all(dirs.map((d) => fs.readdir(d))))
  const componentLines = viewNames.map((n) => {
    const varName = camelCase(n) + 'View'
    return {
      import: `import ${varName} from './${n}'`,
      varName
    }
  })
  return [
    `import { Router } from '@profiscience/knockout-contrib'`,
    ...componentLines.map((c) => c.import),
    'Router.useRoutes([',
    componentLines.map((c) => `  ${c.varName}`).join(',\n'),
    '])'
  ].join('\n')
}
