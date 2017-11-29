import isFunction from 'lodash/isFunction'
import { Context, NormalizedRouteConfig } from '@profiscience/knockout-contrib-router'

export const STATE = Symbol('STATE')

export interface IRouteConfig {
  state?: string
  title?: string | (() => string | Promise<string>)
  component?(): { template: Promise<{ default: string }>, viewModel?: Promise<{ default: any }> }
  children?: Route[]
  with?: { [k: string]: any }
}

export class Route {
  [path: string]: NormalizedRouteConfig[]

  constructor(path: string, r: IRouteConfig) {
    const normalizedConfig: NormalizedRouteConfig[] = []

    if (r.title) {
      normalizedConfig.push(createTitleSetterMiddleware(r.title))
    }

    if (r.children) {
      normalizedConfig.push(Object.assign({}, ...r.children))
    }

    if (r.with) {
      normalizedConfig.push((ctx: Context) => Object.assign(ctx, r.with))
    }

    this[path] = normalizedConfig

    if (r.state) {
      (this[path] as any)[STATE] = r.state
    }
  }
}

function createTitleSetterMiddleware(title: string | (() => string | Promise<string>)) {
  return function*(ctx: Context): IterableIterator<void> {
    const prevTitle = document.title

    yield

    if (isFunction(title)) {
      const v = title()
      if (isFunction((v as Promise<string>).then)) {
        ctx.queue((v as Promise<string>).then((resolvedV: string) => {
          document.title = resolvedV
        }))
      } else {
        document.title = v as string
      }
    } else {
      document.title = title as string
    }

    yield

    yield

    document.title = prevTitle
  }
}
