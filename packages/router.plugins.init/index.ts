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
          .filter((prop: any) => {
            const v = (viewModel as any)[prop]
            return typeof v === 'undefined' || v === null
              ? false
              : v[INITIALIZED]
          })
          .map((prop: any) => (viewModel as any)[prop][INITIALIZED])

        if (viewModel[INITIALIZED]) initializers.push(viewModel[INITIALIZED])

        await Promise.all(initializers)
      })()
    )
  }
}
