import * as ko from 'knockout'
import { RoutePlugin, Router } from '@profiscience/knockout-contrib-router'

// @ts-ignore
import template from './index.html'

const lazyLoadPlugin: RoutePlugin = (componentName: string) => [
  // we return an array that the router understands, so first we'll
  // include the name of the component
  componentName,

  // then some middleware to load that component...
  () => {
    // bail if already loaded
    if (ko.components.isRegistered(componentName)) {
      return
    }

    // https://webpack.js.org/guides/code-splitting-import/
    return (
      import('./views/' + componentName)
        .then((exports) => ko.components.register(componentName, exports))
        // tslint:disable-next-line no-console
        .catch((err) =>
          console.error('Error fetching component', componentName, err)
        )
    )
  }
]

Router.usePlugin(lazyLoadPlugin)

Router.useRoutes({
  '/': 'list',
  '/foo': 'foo',
  '/bar': 'bar',
  '/baz': 'baz',
  '/qux': 'qux'
})

ko.components.register('lazy-loading', { template })
