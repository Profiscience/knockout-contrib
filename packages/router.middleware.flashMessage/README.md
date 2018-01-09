# @profiscience/knockout-contrib-router-middleware-flash-message

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

**NOTE:** It is recommended to use the [@profiscience/knockout-contrib-router-middleware metapackage](../router.middleware)

**NOTE:** [TypeScript >=2.7 is required for symbol keys](https://github.com/Microsoft/TypeScript/pull/15473). For now, use `typescript@next`.

Display a flash message which will be removed after the next navigation.

## Usage

```typescript
import { Router } from '@profiscience/knockout-contrib-router'
import { FLASH_MESSAGE, flashMessageMiddleware, flashMessageText } from '@profiscience/knockout-contrib-router-middleware'

/**
 * Register flashMessageMiddleware. If a property with the FLASH_MESSAGE Symbol is found
 * on the context, flashMessageText will be set with its value. flashMessageText will be
 * cleared during the next navigation.
 */
Router.use(flashMessageMiddleware)

/**
 * Navigate and set flash message for next page using exported FLASH_MESSAGE Symbol
 */
Router.update('/', {
  with: {
    [FLASH_MESSAGE]: 'You are not logged in!'
  }
})

/**
 * Pass the observable containing flash message text to the template.
 */
ko.applyBindings({ flashMessageText })
```