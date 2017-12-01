# knockout-contrib

[![Greenkeeper badge](https://badges.greenkeeper.io/Profiscience/knockout-contrib.svg)](https://greenkeeper.io/)

[![Build Status][travis-ci-shield]][travis-ci]
[![Coverage States][codecov-shield]][codecov]
[![License][wtfpl-shield]][wtfpl]
[![Gitter][gitter-shield]][gitter]

This is the [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) used internally at [Profisciencē](https://profiscience.com) for building rich UIs with [KnockoutJS](https://knockoutjs.com)

# Installation
Individual packages are published under the `@profiscience/knockout-contrib-*` namespace, with package names kebab-cased.

e.g.
```bash
$ yarn add @profiscience/knockout-contrib-router @profiscience/knockout-contrib-observble-fns
```

# Packages
- [jest-matchers](./packages/jest-matchers)
- [observable.fn](./packages/observable.fn)
- [querystring](./packages/querystring)
- [router](./packages/router)
- [utils](./packages/utils)

[travis-ci]: https://travis-ci.org/Profiscience/knockout-contrib/
[travis-ci-shield]: https://img.shields.io/travis/Profiscience/knockout-contrib/master.svg

[codecov]: https://codecov.io/gh/Profiscience/knockout-contrib
[codecov-shield]: https://img.shields.io/codecov/c/github/Profiscience/knockout-contrib.svg

[gitter]: https://gitter.im/Profiscience/knockout-contrib
[gitter-shield]: https://img.shields.io/gitter/room/profiscience/knockout-contrib.svg

[wtfpl]: ./LICENSE.md
[wtfpl-shield]: https://img.shields.io/npm/l/@profiscience/knockout-contrib-router.svg