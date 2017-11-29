import isFunction from 'lodash/isFunction'
import { Plugin, Route, IRouteConfig } from '../Router'

export const titlePlugin: Plugin = (route: Route & IRouteConfig) => {
  if (route.title) {
    // support nesting
    let prevTitle: string
    return (ctx) => ({
      afterRender() {
        prevTitle = document.title
        if (isFunction(route.title)) {
          const v = route.title()
          if (isFunction((v as Promise<string>).then)) {
            ctx.queue((v as Promise<string>).then((resolvedV: string) => {
              document.title = resolvedV
            }))
          } else {
            document.title = v as string
          }
        } else {
          document.title = route.title as string
        }
      },
      afterDispose() {
        document.title = prevTitle
      }
    })
  }
  return []
}
