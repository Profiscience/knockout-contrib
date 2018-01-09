import * as ko from 'knockout'
import { Context, IContext, Route, IRouteConfig } from '@profiscience/knockout-contrib-router'

import { authorizationPlugin } from './index'

describe('router.plugins.authorization', () => {
  test('@todo', () => {
    const ctx = {} as Context & IContext
    const routeConfig: IRouteConfig = { authorization: '@TODO' }
    const middleware = authorizationPlugin(routeConfig)
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
