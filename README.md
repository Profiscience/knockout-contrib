# knockout-contrib

[![KnockoutJS][knockout-shield]][knockoutjs]
[![Build Status][travis-ci-shield]][travis-ci]
[![Coverage States][codecov-shield]][codecov]
[![Gitter][gitter-shield]][gitter]
[![Greenkeeper][greenkeeper-shield]][greenkeeper]

Goodies for building rich UIs with [KnockoutJS][knockoutjs]. Packages are published under the `@profiscience/knockout-contrib-*` namespace.

_e.g._

```shell
$ yarn add @profiscience/knockout-contrib-router @profiscience/knockout-contrib-router-plugins-component
```

##### Why is everything published as a separate package?

_tl;dr it keeps you out of dependency hell_

Publishing a independent packages instead of a single package utilizing tree-shaking or nested imports (i.e. `import 'components/markdown'`) allows each package to have its own semver.

Take the following scenario...

> - you're using `components.a`
> - breaking changes are introduced into `components.a`
> - `components.b` is added, and now you want to use it

If both components are published together, you'd be required to update `components.a` before getting on with the work you set out to do with `components.b`. A monorepo grants the ability to avoid this nonsense while maintaining a unified build/test process.

[knockoutjs]: https://knockoutjs.com
[knockout-shield]: https://img.shields.io/badge/KnockoutJS-v3.5.0--beta-red.svg
[travis-ci]: https://travis-ci.org/Profiscience/knockout-contrib/
[travis-ci-shield]: https://img.shields.io/travis/Profiscience/knockout-contrib/master.svg
[codecov]: https://codecov.io/gh/Profiscience/knockout-contrib
[codecov-shield]: https://img.shields.io/codecov/c/github/Profiscience/knockout-contrib.svg
[gitter]: https://gitter.im/Profiscience/knockout-contrib
[gitter-shield]: https://img.shields.io/gitter/room/profiscience/knockout-contrib.svg
[greenkeeper]: https://greenkeeper.io/
[greenkeeper-shield]: https://badges.greenkeeper.io/Profiscience/knockout-contrib.svg
