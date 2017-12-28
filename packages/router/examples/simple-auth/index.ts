import * as ko from 'knockout'
import { Context, IContext, Middleware, Router } from '@profiscience/knockout-contrib-router'
import template from './index.html'

const authMiddleware: Middleware = (ctx: Context & IContext) => {
  const isLoginPage = ctx.path === '/login'
  const isLoggedIn = sessionStorage.getItem('authenticated')

  if (!isLoggedIn && !isLoginPage) {
    ctx.redirect('//login')
  } else if (isLoggedIn && isLoginPage) {
    ctx.redirect('//')
  }
}

// globally registered auth middleware, runs for every route
Router.use(authMiddleware)

Router.useRoutes({
  '/': 'home',
  '/login': 'login',
  '/logout': (ctx) => {
    sessionStorage.removeItem('authenticated')
    ctx.redirect('/login')
  }
})

ko.components.register('home', {
  template: '<a data-bind="path: \'/logout\'">Logout</a>'
})

ko.components.register('login', {
  viewModel: class {
    public login() {
      sessionStorage.setItem('authenticated', 'true')
      Router.update('/').catch((err) => console.error('Error navigating', err)) // tslint:disable-line no-console
    }
  },
  template: `
    <h1>Login</h1>
    <button data-bind="click: login">Login</button>
  `
})

ko.components.register('simple-auth', { template })
