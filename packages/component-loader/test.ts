import { ComponentLoader } from './'

describe('component-loader', () => {
  test('sync', (done) => {
    const foo = {
      template: '...',
      viewModel: class {}
    }

    const componentLoader = new ComponentLoader({ foo })

    componentLoader.getConfig('foo', (c) => {
      expect(c).toEqual(foo)
      done()
    })
  })

  test('accessor', (done) => {
    const bar = {
      template: '...',
      viewModel: class {}
    }

    const componentLoader = new ComponentLoader({ bar: () => bar })

    componentLoader.getConfig('bar', (c) => {
      expect(c).toEqual(bar)
      done()
    })
  })

  test('promise (lazy, prefetched)', (done) => {
    const baz = {
      template: '...',
      viewModel: class {}
    }

    const componentLoader = new ComponentLoader({ baz: Promise.resolve(baz) })

    componentLoader.getConfig('baz', (c) => {
      expect(c).toEqual(baz)
      done()
    })
  })

  test('async accessor (lazy)', (done) => {
    const qux = {
      template: '...',
      viewModel: class {}
    }

    const componentLoader = new ComponentLoader({
      qux: () => Promise.resolve(qux)
    })

    componentLoader.getConfig('qux', (c) => {
      expect(c).toEqual(qux)
      done()
    })
  })

  test('require context', (done) => {
    const quux = { template: '...' }
    const components = {
      './quux': quux
    }
    type RequireContext = {
      (key: string): any
      keys(): any[]
    }
    const _require = ((v: keyof typeof components) =>
      components[v]) as RequireContext
    _require.keys = () => Object.keys(components)

    const componentLoader = ComponentLoader.fromRequireContext(_require)

    componentLoader.getConfig('quux', (c) => {
      expect(c).toEqual(quux)
      done()
    })
  })

  test('options.transform', (done) => {
    const myComponent = {
      template: '...'
    }

    const componentLoader = new ComponentLoader(
      { myComponent },
      {
        transform: (c) => {
          c.template = 'WORKS'
          return c
        }
      }
    )

    componentLoader.getConfig('myComponent', (c) => {
      expect(c.template).toBe('WORKS')
      done()
    })
  })
})
