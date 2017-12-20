import * as ko from 'knockout'
import { Context, IContext, Middleware } from '@profiscience/knockout-contrib-router'

export function createComponentsLoaderMiddleware(
  componentsAccessor: () => {
    [k: string]: Promise<KnockoutComponentTypes.Config>
  }): Middleware {
  return function*(ctx: Context & IContext): IterableIterator<void> {
    /* beforeRender */
    const componentNames: string[] = []
    const lazyComponents = componentsAccessor()

    Object
      .keys(lazyComponents)
      .forEach((componentName) =>  {
        componentNames.push(componentName)
        ctx.queue(lazyComponents[componentName].then((componentConfig: KnockoutComponentTypes.Config) => {
          ko.components.register(componentName, componentConfig)
        }))
      })

    yield
    /* afterRender */

    yield
    /* beforeDispose */
    componentNames.forEach((c) => ko.components.unregister(c))
  }
}
