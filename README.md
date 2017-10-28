# @profiscience/knockout-contrib

This is the [monorepo](https://github.com/babel/babel/blob/master/doc/design/monorepo.md) used internally at [Profisciencē](https://profiscience.com) for building rich webpapps with [KnockoutJS](https://knockoutjs.com).

# Installation
Individual packages are published under the `@profiscience/knockout-contrib-*` namespace. For example, to install the router package, use

```bash
$ yarn add @profiscience/knockout-contrib-router
```

### Why individual packages instead of ES2015 import + treeshaking?

Versioning. Maintaining large codebase(s) is easy when packages can be updated incrementally at-will.

# Packages
- [router](./packages/router)