import * as ko from 'knockout'
import { Context, IContext, Route, IRouteConfig } from '@profiscience/knockout-contrib-router'

import { {{camelCase name}}Plugin } from './index'

describe('router.plugins.{{camelCase name}}', () => {
  test('@todo', () => {
    const ctx = {} as Context & IContext
    const routeConfig: IRouteConfig = { {{camelCase name}}: '@TODO' }
    const middleware = {{camelCase name}}Plugin(routeConfig)
    const lifecycle = middleware(ctx) as IterableIterator<void>
    
    lifecycle.next()
    // beforeRender
    lifecycle.next()
    // afterRender
    lifecycle.next()
    // beforeDispose
    lifecycle.next()
    // afterDispose
  })
})
