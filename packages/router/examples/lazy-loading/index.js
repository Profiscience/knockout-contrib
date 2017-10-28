import ko from 'knockout'
import { Router } from '@profiscience/knockout-contrib-router'
import lazyComponentLoaderPlugin from './plugins/lazy-component-loader'

Router.setConfig({ base: '/lazy-loading', hashbang: true })

Router.usePlugin(lazyComponentLoaderPlugin)

Router.useRoutes({
  '/':    'list',
  '/foo': 'foo',
  '/bar': 'bar',
  '/baz': 'baz',
  '/qux': 'qux'
}
)

ko.components.register('app', { template: '<router></router>' })

ko.applyBindings()
