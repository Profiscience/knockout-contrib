import * as ko from 'knockout'
// @ts-ignore
import { LazyComponentLoader } from './loader.ts'

describe('components/loader', () => {
  test('registers synchronously with empty config for custom element usage', () => {
    ko.components.register = jest.fn()

    const loader = new LazyComponentLoader({
      foo: () => Promise.resolve()
    })

    expect(ko.components.register).lastCalledWith('foo', {})
  })

  test('works with named exports', (done) => {
    const component = { template: Symbol(), viewModel: Symbol() }

    const loader = new LazyComponentLoader({
      foo: () => Promise.resolve(component)
    })

    loader.getConfig('foo', (config) => {
      expect(config).toEqual({ ...component, synchronous: true })
      done()
    })
  })

  test('works with default exports', (done) => {
    const component = { template: Symbol(), viewModel: Symbol() }

    const loader = new LazyComponentLoader({
      foo: () => Promise.resolve({ default: component })
    })

    loader.getConfig('foo', (config) => {
      expect(config).toEqual({ ...component, synchronous: true })
      done()
    })
  })

  test('skips if not in manifest', (done) => {
    const loader = new LazyComponentLoader({})

    loader.getConfig('foo', (config) => {
      expect(config).toBeNull()
      done()
    })
  })
})
