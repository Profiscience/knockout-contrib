# Utils

## API

#### isActivePath({ router, path }): Computed<boolean>

Returns computed which is `true` if `path` for `router` is currently active

#### resolveHref({ router, path })

Gets an absolute path for `path` on `router`

#### traversePath(router, path)

Resolves `path` in relation to `router`

###### Local

'/foo' route to the `/foo` route on `router`

###### Absolute

'//foo' will route to the `/foo` route on `router.$root`

###### Relative

**parent**
'../foo' will route to the `/foo` route on `router.$parent`

**child**
'./foo' will route to the `/foo` route on `router.$child`
