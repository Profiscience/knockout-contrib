import * as ko from 'knockout'
import { Router, Route } from '@profiscience/knockout-contrib-router'
import { createProgressBarMiddleware } from '@profiscience/knockout-contrib-router-middleware'

declare module '@profiscience/knockout-contrib-router' {
  interface IRouteConfig {
    delay?: number
  }
}

Router.setConfig({
  base: '/router.middleware.progressBar',
  hashbang: true
})

ko.components.register('view', {
  template: `
    <a data-bind="path: '/'">Instant</a>
    <a data-bind="path: '/200ms'">200ms</a>
    <a data-bind="path: '/400ms'">400ms</a>
    <a data-bind="path: '/2s'">2s</a>
    <a data-bind="path: '/5s'">5s</a>
    <a data-bind="path: '/10s'">10s</a>
  `
})

// Use `view` component for all routes
Route.usePlugin(() => 'view')

// for simulating ajax, indexeddb, etc. delay
Route.usePlugin(({ delay }) => () =>
  new Promise((resolve) => setTimeout(resolve, delay))
)

Router.use(createProgressBarMiddleware())

Router.useRoutes([
  new Route('/', 'view'),
  new Route('/200ms', { delay: 200 }),
  new Route('/400ms', { delay: 400 }),
  new Route('/2s', { delay: 2000 }),
  new Route('/5s', { delay: 5000 }),
  new Route('/10s', { delay: 10000 })
])

ko.applyBindings()
