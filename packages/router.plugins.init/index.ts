import { Context, IContext } from '@profiscience/knockout-contrib-router'
import { IRoutedComponentInstance } from '@profiscience/knockout-contrib-router-plugins-component'

export const INITIALIZED = Symbol('INITIALIZED')

export function initializerPlugin() {
  return (ctx: Context & IContext) => {
    if (!ctx.component) return

    ctx.queue((async () => {
      const { viewModel } = await (ctx.component as Promise<IRoutedComponentInstance>)
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
