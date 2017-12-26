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
        templateFiles: 'templates/component/*',
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
}