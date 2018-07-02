# router.middleware.flashMessage

[![Version][npm-version-shield]][npm]
[![Dependency Status][david-dm-shield]][david-dm]
[![Peer Dependency Status][david-dm-peer-shield]][david-dm-peer]
[![Dev Dependency Status][david-dm-dev-shield]][david-dm-dev]
[![Downloads][npm-stats-shield]][npm-stats]

[david-dm]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.middleware.flashMessage
[david-dm-shield]: https://david-dm.org/Profiscience/knockout-contrib/status.svg?path=packages/router.middleware.flashMessage
[david-dm-peer]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.middleware.flashMessage&type=peer
[david-dm-peer-shield]: https://david-dm.org/Profiscience/knockout-contrib/peer-status.svg?path=packages/router.middleware.flashMessage
[david-dm-dev]: https://david-dm.org/Profiscience/knockout-contrib?path=packages/router.middleware.flashMessage&type=dev
[david-dm-dev-shield]: https://david-dm.org/Profiscience/knockout-contrib/dev-status.svg?path=packages/router.middleware.flashMessage
[npm]: https://www.npmjs.com/package/@profiscience/knockout-contrib-router-middleware-flash-message
[npm-version-shield]: https://img.shields.io/npm/v/@profiscience/knockout-contrib-router-middleware-flash-message.svg
[npm-stats]: http://npm-stat.com/charts.html?package=@profiscience/knockout-contrib-router-middleware-flash-message&author=&from=&to=
[npm-stats-shield]: https://img.shields.io/npm/dt/@profiscience/knockout-contrib-router-middleware-flash-message.svg?maxAge=2592000

> **NOTE:** This package is intended for consumption via the [@profiscience/knockout-contrib metapackage](../_)

Display a flash message which will be removed after the next navigation.

## Usage

### Register the Middleware

```typescript
import { flashMessageMiddleware } from '@profiscience/knockout-contrib'

Router.use(flashMessageMiddleware)
```

### Displaying the Flash Message

Create a custom flash message component the exported `flashMessage` observable, or include the [flash-message component](../components.flash-message) (`<contrib-flash-message></contrib-flash-message>`).

#### Default Flash Message Component

See [components.flash-message](../components.flash-message)

#### Custom Flash Message Component

```typescript
import * as ko from 'knockout'
import { Router, flashMessage } from '@profiscience/knockout-contrib'

/**
 * flashMessage is an observable contatining the value passed below
 *
 * The following is an example of how you could add custom properties for your flash message
 */

// If using TypeScript, define the interface for your flash message
declare module '@profiscience/knockout-contrib-router-middleware-flash-message' {
  // tslint:disable-next-line no-shadowed-variable
  interface IFlashMessage {
    text: string
    type?: string
  }
}

ko.components.register('flash-message', {
  viewModel: {
    instance: {
      text: ko.pureComputed(() => {
        const unwrappedFlashMessage = flashMessage()
        if (typeof unwrappedFlashMessage === 'string') {
          return unwrappedFlashMessage
        } else {
          return unwrappedFlashMessage.text
        }
      }),
      css: ko.pureComputed(() => {
        const unwrappedFlashMessage = flashMessage()
        if (typeof unwrappedFlashMessage.type !== 'undefined') {
          return unwrappedFlashMessage.type
        } else {
          return 'info'
        }
      })
    }
  },
  template: `<div class="flash-message" data-bind="text: text, css: css"><div>`
})
```

### Setting a Flash Message

Set message by extending the context prior to navigating via `Router.update`, `ctx.update`, or `ctx.redirect` via the `with` option and the exported symbol.

```typescript
import { Router } from '@profiscience/knockout-contrib-router'
import { FLASH_MESSAGE } from '@profiscience/knockout-contrib-router-middleware'

/**
 * The following are supported by the default flash message component.
 * As shown above, you can configure this however you'd like if you're
 * using a custom component
 */
Router.update('/', {
  with: {
    // set only the text and use default values for other options
    [FLASH_MESSAGE]: 'You are not logged in!'

    [FLASH_MESSAGE]: {
      text: 'Saved successfully!',  // flash message text
      type: 'success',              // bootstrap alert type, default: info
      dismiss: true,                // allow dismissing the flash message, default: false
      timeout: 5000                 // automatically dismiss the flash message after timeout in ms, default: false
    }
  }
})
```
