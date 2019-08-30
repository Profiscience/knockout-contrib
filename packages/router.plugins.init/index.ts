import {
  Context,
  IContext,
  SimpleMiddleware,
  IRouteConfig
} from '@profiscience/knockout-contrib-router'
import { IRoutedComponentInstance } from '@profiscience/knockout-contrib-router-plugins-component'

export const INITIALIZED = Symbol('INITIALIZED')

export function componentInitializerRoutePlugin(
  routeConfig: IRouteConfig
): SimpleMiddleware | void {
  if (!routeConfig.component) return

  return (ctx: Context & IContext) => {
    ctx.queue(
      (async () => {
        const { viewModel } = await (ctx.component as Promise<
          IRoutedComponentInstance
        >)

        if (!viewModel) return

        const initializers = Object.keys(viewModel)
          .filter((prop) => {
            const v = viewModel[prop]
            return typeof v === 'undefined' || v === null
              ? false
              : v[INITIALIZED]
          })
          .map((prop) => viewModel[prop][INITIALIZED])

        if (viewModel[INITIALIZED]) initializers.push(viewModel[INITIALIZED])

        await Promise.all(initializers)

        if (viewModel.init) {
          await viewModel.init()
        }
      })()
    )
  }
}
