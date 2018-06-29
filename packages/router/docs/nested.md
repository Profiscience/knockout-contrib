# Nested

Nested routes are registered by

- with constructor syntax by including a route as an argument to the parent
- with object syntax by including another route map in the config

### Object Syntax

```typescript
import * as ko from 'knockout'
import { Router } from '@profiscience/knockout-contrib'

Router.useRoutes({
  '/user': {
    '/': 'user-list',
    '/new': 'user-create',
    '/:id': 'user-show',
    '/:id/edit': 'user-edit'
  }
})
```

### Route Constructor Syntax

```typescript
import * as ko from 'knockout'
import { Route, Router } from '@profiscience/knockout-contrib'

Router.useRoutes([
  new Route('/user', [
    new Route('/', 'user-list'),
    new Route('/', 'user-create'),
    new Route('/:id', 'user-show'),
    new Route('/:id/edit', 'user-edit')
  ])
])
```

You can also mix-and-match, should you find it appropriate...

```typescript
import * as ko from 'knockout'
import { Route, Router } from '@profiscience/knockout-contrib'

Router.useRoutes([
  new Route('/user', {
    '/': 'user-list',
    '/new': 'user-create',
    '/:id': 'user-show',
    '/:id/edit': 'user-edit'
  })
])
```

## Custom Wrapper Components

If an empty template isn't enough for you, you can still pass a component
name to the route along with your nested routes, and include a `<router></router>`
in that component.

```javascript
import ko from 'knockout'
import { Router } from '@profiscience/knockout-contrib'

Router.useRoutes({
  '/user': [
    'user-header',
    {
      '/': 'user-list',
      '/new': 'user-create',
      '/:id': 'user-show',
      '/:id/edit': 'user-edit'
    }
  ]
})

ko.components.register('user-header', {
  template: `
    <a data-bind="path: '/'">
      List
    </a>
    <a data-bind="path: '/new'">
      New User
    </a>

    <router></router>
  `
})
```

## Passing Data to Children

One short-lived feature of the router was passthrough params; for reasons outlined
in [this blog post](https://medium.com/@notCaseyWebb/building-a-better-router-ef42896e2e5a),
that presented issues with optimal execution of nested router middleware. In order
to pass data between parent and child routers, it must be attached to the context in
a middleware function. This is an opinionated approach that prevents you from doing
initialization/data fetching in the viewModels, but this should be seen as a
best practice and not a downfall as it leads to more modularization,
easier unit testing of business logic, and easier to maintain viewModels as they
are concerned only with UI interactions. See [best practices](./best-practices.md) for more.

---

[Back](./)
