import { Context, IContext } from '@profiscience/knockout-contrib-router'
import { IRoutedComponentInstance } from '@profiscience/knockout-contrib-router-plugins-component'

export const INITIALIZED = Symbol('INITIALIZED')

export function initializerPlugin() {
  return (ctx: Context & IContext) => {
    if (!ctx.component) return

    ctx.queue((async () => {
      const { viewModel } = await (ctx.component as Promise<IRoutedComponentInstance>)

      if (viewModel) {
        const initializers = Object
          .keys(viewModel)
          .filter((prop: any) => {
            const v = (viewModel as any)[prop]
            return typeof v === 'undefined' || v === null
              ? false
              : v[INITIALIZED]
          })
          .map((prop: any) => (viewModel as any)[prop][INITIALIZED])

        if (viewModel[INITIALIZED]) initializers.push(viewModel[INITIALIZED])

        await Promise.all(initializers)
      }
    })())
  }
}
