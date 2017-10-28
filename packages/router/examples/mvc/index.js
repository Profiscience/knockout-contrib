import ko from 'knockout'
import { Router } from '@profiscience/knockout-contrib-router'
import routes from './routes'
import componentPlugin from './plugins/component'
import middlewarePlugin from './plugins/middleware'

Router.setConfig({ base: '/mvc', hashbang: true })

Router.usePlugin(componentPlugin)
Router.usePlugin(middlewarePlugin)

Router.useRoutes(routes)

ko.components.register('app', { template: '<router></router>' })

ko.applyBindings()
