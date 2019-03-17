import { intersection } from 'lodash'
import { BuildOptions } from '../commands/build'

export function inAtLeastOneScope(
  argv: BuildOptions,
  ...scopes: BuildScopes[]
) {
  return !argv.scope || intersection(argv.scope, scopes).length > 0
}

export function inAllScopes(argv: BuildOptions, ...scopes: BuildScopes[]) {
  return (
    !argv.scope || intersection(argv.scope, scopes).length === scopes.length
  )
}

export function skipUnlessAtLeastOneOf(
  argv: BuildOptions,
  ...scopes: BuildScopes[]
) {
  return () => {
    if (!inAtLeastOneScope(argv, ...scopes)) {
      return `Out of scope (${argv.scope})`
    }
  }
}

export function skipUnlessAll(argv: BuildOptions, ...scopes: BuildScopes[]) {
  return () => {
    if (!inAllScopes(argv, ...scopes)) return `Out of scope (${argv.scope})`
  }
}
