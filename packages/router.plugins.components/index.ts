import * as ko from 'knockout'
import {
  Context,
  IContext,
  IRouteConfig,
  LifecycleMiddleware
} from '@profiscience/knockout-contrib-router'

declare module '@profiscience/knockout-contrib-router' {
  // tslint:disable-next-line no-shadowed-variable
  interface IRouteConfig {
    components?: LazyComponentsAccessor
  }
}

export type LazyComponentsAccessor = () => ILazyComponents

export interface ILazyComponents {
  [k: string]: Promise<{
    template: string
    viewModel?: ko.components.ViewModelConstructor
  }>
}

interface IComponentMap {
  [k: string]: {
    template: string
    viewModel?: ko.components.ViewModelConstructor
  }
}

export function componentsRoutePlugin({
  components
}: IRouteConfig): LifecycleMiddleware | void {
  if (!components) return

  return (ctx: Context & IContext) => {
    let componentNames: string[] = []

    return {
      beforeRender() {
        ctx.queue(
          fetchComponents(components).then((componentMap) => {
            componentNames = Object.keys(componentMap)
            componentNames.forEach((componentName) => {
              ko.components.register(componentName, componentMap[componentName])
            })
          })
        )
      },
      beforeDispose() {
        componentNames.forEach((c) => ko.components.unregister(c))
      }
    }
  }
}

async function fetchComponents(componentsAccessor: LazyComponentsAccessor) {
  const lazyComponents = componentsAccessor()
  const components: IComponentMap = {}
  await Promise.all(
    Object.keys(lazyComponents).map(async (componentName) => {
      const componentConfig = await lazyComponents[componentName]
      components[componentName] = componentConfig
    })
  )
  return components
}
