# router.plugins.component

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins.component
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/router.plugins.component
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins.component&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/router.plugins.component
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.plugins.component&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/router.plugins.component
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-router-plugins-component
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-router-plugins-component.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-router-plugins-component&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-router-plugins-component.svg?maxAge=2592000

Sets the component for a route. Intended for use with dynamic imports for intuitive code-splitting/lazy-loading of views.

## Usage

```typescript
import { Route, componentRoutePlugin } from '@profiscience/knockout-contrib'

Route.usePlugin(componentRoutePlugin)

// RECOMMENDED USAGE
new Route('/', {
  component: () => ({
    template: import('./template.html'),
    viewModel: import('./viewModel')
  })
})
```

### Anonymous Components

Annymous components are registered/unregistered by the router as-needed. Simply pass the component configuration you would pass to Knockout.

```typescript
new Route('/', {
  component: {
    template: 'Hello, World!'
  }
})
```

By default, the component will be registered using a incrementing GUID (`__router_view_${i}__`). You may specify the name to register the component as by providing the optional `name` property.

```typescript
new Route('/', {
  component: {
    name: 'hello-view',
    template: 'Hello, World!'
  }
})
```

**NOTE**: Custom component loaders will **NOT** be used.

**NOTE**: Non-`class` viewModels are supported, but not recommended. See the caveats section below.

**NOTE**: If your viewModel can be instantiated with `new`, the instance will be accessible on `ctx.component.viewModel` after the beforeRender queue completes. Before this, it will be a promise that resolves its eventual value. i.e.

```typescript
// after plugin execution, before beforeRender queue completes
ctx.component = Promise<{ viewModel }>

// after beforeRender queue completes, all subsequent middleware lifecycle stages (afterRender, beforeDispose, afterDispose)
ctx.component = { viewModel }
```

### Named Components

Named components are components that are _already_ registered with Knockout.

```typescript
ko.components.register('hello-component', { template: 'Hello, World!' })

new Route('/', {
  component: 'hello-component'
})
```

### Using Accessors

If you need more control, you may use an accessor function. This function recieves the route context as its first and only argument and returns either of the above configurations, optionally promised.

```typescript
new Route('/', {
  component: (ctx) => ({ template: 'Hello, World!' })
})
```

## API

Several normalization passes are done on the supplied configuration to attempt to handle whatever you throw at it. The full type signature is...

```typescript
type MaybePromise<T> = T | Promise<T>
type MaybeDefaultExport<T> = T | { default: T }
type MaybeAccessor<A, T> = T | ((A) => T)
type MaybeLazy<T extends {}> = MaybePromise<
  { [P in keyof T]: MaybePromise<MaybeDefaultExport<T[P]>> }
>
interface IRoutedViewModelConstructor {
  new (ctx: Context & IContext): any
}
type IAnonymousComponent = {
  name?: string
  template: string
  viewModel?: IRoutedViewModelConstructor
}
interface IRouteConfig {
  component?: IRouteComponentConfig
}
type IRouteComponentConfig =
  | MaybeAccessor<Context & IContext, MaybePromise<string>>
  | MaybeAccessor<
      Context & IContext,
      MaybePromise<MaybeLazy<IAnonymousComponent>>
    >
```

## Caveats / Subtleties

### Implicit Default Imports

Take the following...

```typescript
new Route('/', {
  component: async () => ({
    viewModel: await import('./viewModel')
  })
})
```

In this case, `viewModel.(ts|js)` exports the viewModel constructor as default. But, depending on a few factors (your bundling/transpilation setup, and if there are named exports as well as the default), the way to access the viewModel constructor can vary at runtime. In some cases, the `import` call will return a promise that resolves the constructor, in other cases it will return a promise that resolves an object with a `default` property containing the constructor (`Promise<{ default: ViewModel }>`). Rather than requiriring you to figure out when/where to append `.then((imports) => imports.default)` or something similar all over the place, if an object with a `.default` property is resolved, the contents of that default property will be hoisted.

### Implicit Async/Await

If your configuration is an object with promised value, you may forgo wrapping the accessor function in `async`/`await`. Promised values will be resolved and aggregated into a new object before registering the component.

```typescript
new Route('/', {
  component: () => ({
    template: import('./template.html'),
    viewModel: import('./viewModel')
  })
})
```

### "Unable to instantiate viewModel. This may cause unexpected behavior. See caveats/subtleties in documentation."

When using anonymous components, the router prefers to instantiate the viewModel itself and register components using that instance, i.e. `ko.components.register('__router_view_1__', { viewModel: { instance } })`. It does this in order to attach the viewModel instance to the context — as `ctx.component.viewModel` — to provide opportunities to interop with other middleware/plugins. See the [router.plugins.init](../router.plugins.init) + [model.builders.data](../model.builders.data) packages to better understand why this is desireable, as they make use of this.

Additionally, by providing the router with direct access to the viewModel constructor (and thus instance), it is able to control the timing of the `dispose` method on the viewModel (if any), helping to prevent weird timing issues (and adding support for asynchronous disposal via promises!).

You are seeing this warning because you have provided a a) viewModel that is something other than a class which can be called with `new` — a createViewModel factory perhaps or b) a named component. In either case, the router is unable to instantiate the viewModel in a predictable manner and falls back to allowing Knockout to instantiate the viewModel _at render_ instead of _before render_. If you are not using any middleware/plugins that perform introspection on the viewModel instance (i.e. access `ctx.component.viewModel`), you can safely ignore this warning. Disable it permanently with the following...

```typescript
import { disableUninstantiableViewModelWarning } from '@profiscience/knockout-contrib-router-plugins-component'

disableUninstantiableViewModelWarning()
```
