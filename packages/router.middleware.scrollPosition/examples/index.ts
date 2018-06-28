import * as ko from 'knockout'
import { Context, Route, Router } from '@profiscience/knockout-contrib-router'
import { createScrollPositionMiddleware } from '@profiscience/knockout-contrib-router-middleware-scroll-position'

function range(n: number) {
  const nums = []
  for (let i = 0; i < n; i++) nums.push(i)
  return nums
}

ko.components.register('view', {
  viewModel: class {
    public nums = range(200)
    public otherPath: string
    constructor(ctx: Context) {
      this.otherPath = ctx.pathname === '/' ? '/2' : '/'
    }
  },
  template: `
    <div class="controls">
      <a data-bind="path: otherPath">Navigate Forward</a>
      <a data-bind="path: otherPath + '#50'">Navigate Forward to #50</a>
      <a href="#" data-bind="click: () => history.back()">Navigate Back (Try Back Button also)</a>
    </div>
    <ul data-bind="foreach: nums">
      <li data-bind="attr: { id: $data }, text: $data"></li>
    </ul>
  `,
  synchronous: true
})

Router.setConfig({
  base: '/router.middleware.scrollPosition',
  hashbang: true
})

Router.use(
  createScrollPositionMiddleware({
    scrollTo: (x, y) => window.scroll({ top: y, behavior: 'smooth' })
  })
)

Router.useRoutes([new Route('/', 'view'), new Route('/2', 'view')])

ko.applyBindings()
