import * as ko from 'knockout'
import { Context, IContext, IRouteConfig, Middleware } from '@profiscience/knockout-contrib-router'

declare module '@profiscience/knockout-contrib-router' {
  // tslint:disable-next-line no-shadowed-variable
  interface IRouteConfig {
    components?: LazyComponentsAccessor
  }
}

export type LazyComponentsAccessor = () => ILazyComponents

export interface ILazyComponents {
  [k: string]: Promise<{ template: string, viewModel?: KnockoutComponentTypes.ViewModelFunction }>
}

interface IComponentMap {
  [k: string]: {
    template: string,
    viewModel?: KnockoutComponentTypes.ViewModelFunction
  }
}

export function componentsPlugin({ components }: IRouteConfig): Middleware {
  return function*(ctx: Context & IContext): IterableIterator<void> {
    if (!components) return

    let componentNames: string[] = []

    /* beforeRender */
    ctx.queue(fetchComponents(components).then((componentMap) => {
      componentNames = Object.keys(componentMap)
      componentNames.forEach((componentName) => {
        ko.components.register(componentName, componentMap[componentName])
      })
    }))

    yield
    /* afterRender */

    yield
    /* beforeDispose */

    componentNames.forEach((c) => ko.components.unregister(c))
  }
}

async function fetchComponents(componentsAccessor: LazyComponentsAccessor) {
  const lazyComponents = componentsAccessor()
  const components: IComponentMap = {}
  await Promise.all(
    Object
      .keys(lazyComponents)
      .map(async (componentName) => {
        const componentConfig = await lazyComponents[componentName]
        components[componentName] = componentConfig
      })
  )
  return components
}
