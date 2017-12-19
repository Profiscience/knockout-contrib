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
}