import * as ko from 'knockout'
import { Context, IContext, IRouteConfig } from '@profiscience/knockout-contrib-router'
import { INITIALIZED } from '@profiscience/knockout-contrib-model'

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
            .map(async (dataModelProp: any) => await (viewModel as any)[dataModelProp][INITIALIZED])
        )
      }
    })())
  }
}
