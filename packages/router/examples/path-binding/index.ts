import ko from 'knockout'
import { Router } from '@profiscience/knockout-contrib-router'
import template from './index.html'

function createOuterTemplate(foo) {
  return `
    <h1>${foo}</h1>

    These begin with '/', so they route using the current (containing) router
    <br>
    <a data-bind="path: '/foo'">/foo</a>
    <a data-bind="path: '/bar'">/bar</a>

    <br>
    <br>

    This begins with './', so it is routed using the child (adjacent) router
    <br>
    <a data-bind="path: './baz'">./baz</a>

    <br>
    <br>

    This begins with '//', so it is routed using the root router
    <br>
    <a data-bind="path: '//${foo}/qux'">//${foo}/qux</a>

    <router></router>
  `
}

function createInnerTemplate(foo) {
  return `
    <h2>${foo}</h2>

    These begin with '/', so they route using the current (containing) router
    <br>
    <a data-bind="path: '/baz'">/baz</a>
    <a data-bind="path: '/qux'">/qux</a>
  `
}

ko.components.register('empty', { template: '<span></span>' })

ko.components.register('foo', { template: createOuterTemplate('foo') })
ko.components.register('bar', { template: createOuterTemplate('bar') })
ko.components.register('baz', { template: createInnerTemplate('baz') })
ko.components.register('qux', { template: createInnerTemplate('qux') })

Router.useRoutes({
  '/': 'empty',
  '/foo': ['foo',
    {
      '/': 'empty',
      '/baz': 'baz',
      '/qux': 'qux'
    }
  ],
  '/bar': ['bar',
    {
      '/': 'empty',
      '/baz': 'baz',
      '/qux': 'qux'
    }
  ]
})

ko.components.register('path-binding', { template })
