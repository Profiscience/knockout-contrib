'use strict'

module.exports = (plop) => {
  plop.setGenerator('binding', {
    description: 'Create a new binding handler',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'binding name'
      },
      {
        type: 'confirm',
        name: 'namespaced',
        message: 'namespaced?',
        default: false
      }
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'packages/bindings.{{ camelCase name }}',
        templateFiles: 'templates/binding/*',
        base: 'templates/binding'
      }
    ]
  })
  plop.setGenerator('component', {
    description: 'Create a new component',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'component name'
      }
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'packages/components.{{ kebabCase name }}',
        templateFiles: 'templates/component/**/*',
        base: 'templates/component'
      }
    ]
  })
  plop.setGenerator('observable.fn', {
    description: 'Create a new observable function',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'function name'
      }
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'packages/observable.fn.{{ kebabCase name }}',
        templateFiles: 'templates/observable.fn/*',
        base: 'templates/observable.fn'
      }
    ]
  })
  plop.setGenerator('router.middleware', {
    description: 'Create a new middleware function for the router package',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'middleware name'
      }
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'packages/router.middleware.{{ kebabCase name }}',
        templateFiles: 'templates/router.middleware/*',
        base: 'templates/router.middleware'
      }
    ]
  })
  plop.setGenerator('router.plugin', {
    description: 'Create a new Route plugin for the router package',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'plugin name'
      }
    ],
    actions: [
      {
        type: 'addMany',
        destination: 'packages/router.plugins.{{ kebabCase name }}',
        templateFiles: 'templates/router.plugin/*',
        base: 'templates/router.plugin'
      }
    ]
  })
}