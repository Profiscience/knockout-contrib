'use strict'

const path = require('path')
const execa = require('execa')

const standardPrompts = [
  {
    type: 'input',
    name: 'name',
    message: 'name'
  }
]

function initializePackage({ metapackage, casing, template }) {
  return [
    {
      type: 'addMany',
      destination: `packages/${metapackage}.{{ ${casing} name }}`,
      templateFiles: `templates/${template}/**/*`,
      base: `templates/${template}`
    },
    { type: 'meta' },
    { type: 'install' }
  ]
}

module.exports = (plop) => {
  plop.setActionType('install', () => execa('yarn', ['install'], { stdio: 'inherit' }).then(() => 'Linked dependencies'))
  plop.setActionType('meta', () => execa('./node_modules/.bin/taskr', ['meta'], { stdio: 'inherit' }).then(() => 'Rebuilt meta packages'))
  plop.setHelper('getCurrentVersion', (pkg) => require(path.join(__dirname, 'packages', pkg, 'package.json')).version)

  plop.setGenerator('binding', {
    description: 'Create a new binding handler',
    prompts: [
      ...standardPrompts,
      {
        type: 'confirm',
        name: 'namespaced',
        message: 'namespaced?',
        default: false
      }
    ],
    actions: initializePackage({ metapackage: 'bindings', casing: 'camelCase', template: 'binding' })
  })
  plop.setGenerator('component', {
    description: 'Create a new component',
    prompts: standardPrompts,
    actions: initializePackage({ metapackage: 'components', casing: 'kebabCase', template: 'component' })
  })
  plop.setGenerator('observable.fn', {
    description: 'Create a new observable function',
    prompts: standardPrompts,
    actions: initializePackage({ metapackage: 'observable.fn', casing: 'kebabCase', template: 'observable.fn' })
  })
  plop.setGenerator('router.middleware', {
    description: 'Create a new middleware function for the router package',
    prompts: standardPrompts,
    actions: initializePackage({ metapackage: 'router.middleware', casing: 'camelCase', template: 'router.middleware' })
  })
  plop.setGenerator('router.plugin', {
    description: 'Create a new Route plugin for the router package',
    prompts: standardPrompts,
    actions: initializePackage({ metapackage: 'router.plugins', casing: 'camelCase', template: 'router.plugin' })
  })
}