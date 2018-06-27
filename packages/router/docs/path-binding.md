# Path Binding

For your convenience, the router includes a binding called `path` that allows
you to set the href of anchor tags without mucking around with the base path
and having to juggle different levels too much.

**NOTE:** The path binding sets the href attribute, so it will only work on anchor
tags for navigation. However, it can be used on any element for styling.

Parses path using [utils.traversePath](./utils.md#traversePath)

### Local

```html
<a data-bind="path: '/foo'">
```

This will route to the `/foo` route on the current router (the one that this
page belongs to).

### Absolute

```html
<a data-bind="path: '//foo'">
```

This will route to the `/foo` route at the top-level router.

### Relative

**parent**

```html
<a data-bind="path: '../foo'">
```

This will route to the `/foo` route at the parent router.

**child**

```html
<a data-bind="path: './foo'">
```

This will route to the `/foo` route at the child (adjacent) router.

## Styling Elements

By default, the router adds the `active-path` css class to any anchor with a
path binding that resolves to the current page. To use a class other than
`active-path`, you may configure it globally in the router's config as
`activePathCSSClass`, or use the supplementary `pathActiveClass` binding.

```html
<a data-bind="path: '/foo', pathActiveClass: 'foo-active'">
```

If you _only_ need this fuctionality, you may use the `activePath` binding instead. This will behave almost exactly the same, however the href attribute will not be set.

Partial matches are supported using `*`. For example, if you have a nested route structure such as...

```typescript
new Route('/foos', [
  new Route('/foo', ...),
  new Route('/bar', ...),
  new Route('/baz', ...),
  new Route('/qux', ...)
])
```

And you would like to apply the `active-path` class to an element if the route is any of the child routes belonging to the "foos" route (i.e. '/foos/foo', '/foos/bar', etc.), use the following...

```html
<a data-bind="path: '/foos/*'">Foos</a>
```

The wildcard _must_ be the last character, and it _must_ be immediately preceeded by a `/`. It will be disregarded for the purposes of setting the href if used with the `path` binding.

---

[Back](./)
