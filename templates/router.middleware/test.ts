import { Context, IContext } from '@profiscience/knockout-contrib-router'
import { {{camelCase name}}Middleware } from './index'

describe('router.middleware.{{camelCase name}}', () => {
  test('@TODO', () => {
    const ctx: Context & IContext = { } as Context & IContext
    const lifecycle = {{camelCase name}}Middleware(ctx)

    lifecycle.next()
    /* beforeRender */

    lifecycle.next()
    /* afterRender */

    lifecycle.next()
    /* beforeDispose */

    lifecycle.next()
    /* afterDispose */
  })
})
