## Installation

```bash
$ yarn add @profiscience/knockout-contrib-router
```

_or_

```bash
$ npm install @profiscience/knockout-contrib-router
```

The following browser features are required:

| Feature     | Browser Support | Polyfill                              |
| ----------- | --------------- | ------------------------------------- |
| Promises/A+ | [Link][promise] | [es6-promise][promise-polyfill]       |
| History     | [Link][history] | [html5-history-api][history-polyfill] |

If using the above HTML5 history polyfill, be sure to configure the polyfill after loading;
the polyfill must have the `!` path prefix registered via:

```javascript
window.history.setup('/', '!/', null)
```

## Configuration

Configuration is set using the static `.setConfig` method on the `Router` class

```javascript
import { Router } from '@profiscience/knockout-contrib'

Router.setConfig({
  // base path app runs under, i.e. '/app'
  base: '',

  // use legacy hashbang routing (History API or polyfill still required)
  hashbang: false,

  // CSS class added to elements with a path binding that resolves to the current
  // page — useful for styling navbars and tabs
  activePathCSSClass: 'active-path'
})
```

## Registering Routes

Routes are registered using the static `.useRoutes` method on the Router.

At its core, a route consists of a component name, middleware, and children. Any of these
items may be omitted, or combined. There are two main ways to register routes.

### Object Syntax

Routes may be objects with [express style routes](https://github.com/pillarjs/path-to-regexp)
as keys, and a(n)
a) component name for the view
b) [middleware](./middleware.md) function
c) [nested route map](./nested-routing.md)
d) array containing any combination of the above

```typescript
import { Router } from '@profiscience/knockout-contrib'

Router.useRoutes({
  routes: {
    '/': 'home', // component

    '/users': {
      // nested route map
      '/': [
        loadUsers, // middleware
        'user-list' // component name
      ],

      '/:id': [
        loadUser, // middleware
        {
          // nested route map
          '/': 'user-show', // component name
          '/edit': 'user-edit' // component name
        }
      ]
    }
  }
})
```

### Route Constructor Syntax

Alternatively, you may use the `Route` constructor, create the route instances and
register them directly.

```typescript
import { Route, Router } from '@profiscience/knockout-contrib'

Router.useRoutes([
  new Route('/', 'home'),

  // the children don't actually have to be in an array, but it helps for formatting.
  // all configuration, including that returned from plugins, will be flattened.
  new Route('/users', [
    // on the same note, we could use [loadUsers, 'user-list'] and it would behave
    // identically.
    new Route('/', loadUsers, 'user-list'),
    new Route('/:id', loadUser, [
      new Route('/', 'user-show'),
      new Route('/edit', 'user-edit')
    ])
  ])
])
```

So, why would you choose to use this more verbose syntax? Because you're using TypeScript, of course!
While you'll get type-safety with the object syntax, any type mismatches will show an error at the
site of your `.registerRoutes` call, and not where the error actually is. This error is most-likely
extremely verbose and deeply nested and can be a PITA to track down when your routes are scattered across
multiple files (for example, you have a route which imports 3 routes, each of which are children).

Using the Route constructor, each file that exports a route _knows_ it's exporting a route, not just some
arbitrary JS object. [See the PR that added Route Constructor syntax for more](https://github.com/Profiscience/knockout-contrib/pull/26).

---

It should be noted, _both_ of the above syntaxes are just the default, and you are encouraged to
use [plugins](./plugins.md) to set up an architecture that makes sense for your app. For more on
this, see the [best practices](./best-practices.md) or check out [Ali](https://github.com/caseyWebb/ali).

[Back](./README.md)

[promise]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#Browser_compatibility 'MDN - Promise'
[promise-polyfill]: https://github.com/stefanpenner/es6-promise 'es6-promise'
[history]: https://developer.mozilla.org/en-US/docs/Web/API/History_API#Browser_compatibility 'MDN - History API'
[history-polyfill]: https://github.com/devote/HTML5-History-API 'HTML5-History-API'
