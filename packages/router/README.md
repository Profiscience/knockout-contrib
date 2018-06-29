# @profiscience/knockout-contrib-router

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]
[![Gitter][gitter-shield]][gitter]

Super-duper flexible component based router + middleware framework for developing wicked awesome single page apps with [KnockoutJS][]

### Installation

```bash
$ npm install @profiscience/knockout-contrib-router
```

...or...

```bash
$ yarn add @profiscience/knockout-contrib-router
```

### Usage

_app.js_

```typescript
import * as $ from 'jquery'
import * as ko from 'knockout'
import { Route, Router } from '@profiscience/knockout-contrib'

const loading = ko.observable(true)

Router.use(loadingMiddleware)

Router.useRoutes([
  new Route('/', 'home'),
  new Route('/users', [
    new Route('/', [loadUsers, 'users']),
    new Route('/:id', [loadUser, 'user'])
  ])
])
/**
 * Optionally use object-shorthand
 *  Router.useRoutes({
 *    '/': 'home',
 *    '/users': {
 *      '/': [loadUsers, 'users'],
 *      '/:id': [loadUser, 'user']
 *    }
 *  })
 */

ko.components.register('home', {
  template: `<a data-bind="path: '/users'">Show users</a>`
})

ko.components.register('users', {
  viewModel: class UsersViewModel {
    constructor(ctx) {
      this.users = ctx.users
    }

    navigateToUser(user) {
      Router.update('/users/' + user.id, { with: { user } })
    }
  },
  template: `
    <ul data-bind="foreach: users">
      <span data-bind="text: name, click: $parent.navigateToUser"></span>
    </ul>
  `
})

ko.components.register('user', {
  viewModel: class UserViewModel {
    constructor(ctx) {
      this.user = ctx.user
    }
  },
  template: `...`
})

function loadingMiddleware(ctx) {
  return {
    beforeRender() {
      loading(true)
    },
    afterRender() {
      loading(false)
    }
  }
}

// generators are also supported if you're a pioneer of sorts
// function * loadingMiddleware(ctx) {
//   loading(true)
//   yield
//   loading(false)
// }

// TypeScript? Good for you! Just add ~water~ these lines
// declare module '@profiscience/knockout-contrib-router' {
//   interface IContext {
//     user?: MyUserTypeDef
//     users?: MyUserTypeDef[]
//   }
// }

function loadUsers(ctx) {
  // return promise for async middleware
  return $.get('/api/users/').then((us) => (ctx.users = us))
}

function loadUser(ctx) {
  // if not passed in via `with` from Users.navigateToUser
  if (!ctx.user) {
    return $.get('/api/users/' + ctx.params.id).then((u) => (ctx.user = u))
  }
}

ko.applyBindings({ loading })
```

_index.html_

```html
<router data-bind="css: { opacity: loading() ? .5 : 1 }"></router>
```

[More](./docs)

[knockoutjs]: https://knockoutjs.com
[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/router
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/router
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/router
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-router
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-router.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-router&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-router.svg?maxAge=2592000
[gitter]: https://gitter.im/Profiscience/ko-component-router
[gitter-shield]: https://img.shields.io/gitter/room/profiscience/ko-component-router.svg
