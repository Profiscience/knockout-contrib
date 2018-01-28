import * as ko from 'knockout'
import { Context, IContext, IRouteConfig } from '@profiscience/knockout-contrib-router'

export const INITIALIZED = Symbol('INITIALIZED')

// for ctx.component type definition
import '@profiscience/knockout-contrib-router-plugins-component'

export function dataPlugin() {
  return (ctx: Context & IContext) => {
    if (!ctx.component) return

    ctx.queue((async () => {
      const { viewModel } = await ctx.component
      if (viewModel) {
        await Promise.all(
          Object
            .keys(viewModel)
            .filter((prop: any) => (viewModel as any)[prop][INITIALIZED])
            .map((prop: any) => (viewModel as any)[prop][INITIALIZED])
        )
      }
    })())
  }
}
