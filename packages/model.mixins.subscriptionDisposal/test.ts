import * as ko from 'knockout'

import { SubscriptionDisposalMixin as Subscribable } from './index'

class EmptyClass {
  public dispose() {
    /* noop */
  }
}

describe('model.mixins.subscriptionDisposal', () => {
  describe('.subscribe()', () => {
    test('.subscribe(obs, fn) is equivalent to obs.subscribe(fn)', async () => {
      const instance = new (Subscribable(EmptyClass))()
      const obs = ko.observable() as ko.Observable<string>

      const p = new Promise((resolve) =>
        instance.subscribe(
          obs,
          // check type safety
          (newval) => resolve(newval as string)
        )
      )

      obs('gucci')

      await expect(p).resolves.toBe('gucci')

      instance.dispose()
    })

    test('.subscribe() accepts a function', () => {
      expect.assertions(2)

      const instance = new (Subscribable(EmptyClass))()
      const obs1 = ko.observable()
      const obs2 = ko.observable()
      const accessor = () => `${obs1()} ${obs2()}`

      let assertions = 0

      instance.subscribe(accessor, (newVal: string) => {
        switch (++assertions) {
          case 1:
            expect(newVal).toBe('gucci undefined')
            break
          case 2:
            expect(newVal).toBe('gucci mane')
            break
        }
      })

      obs1('gucci')
      obs2('mane')

      instance.dispose()
    })

    test('.subscribe() accepts an observable tree', async () => {
      expect.assertions(3)

      const instance = new (Subscribable(EmptyClass))()
      const obs1: ko.Observable<string> = ko.observable()
      const obs2: ko.Observable<string> = ko.observable()
      const tree = {
        obs1,
        obs2
      }

      let assertions = 0

      instance.subscribe(tree, (newVal) => {
        switch (++assertions) {
          case 1:
            expect(newVal.obs1).toBe('gucci')
            break
          case 2:
            expect(newVal.obs1).toBe('gucci')
            expect(newVal.obs2).toBe('mane')
            break
        }
      })

      obs1('gucci')
      obs2('mane')

      instance.dispose()
    })
  })

  describe('.unsubscribe()', () => {
    test('works when passed same function', (done) => {
      expect.assertions(1)

      const instance = new (Subscribable(EmptyClass))()
      const obs = ko.observable('')

      const fn = (v: any) => expect(v).toBe('foo')

      instance.subscribe(obs, fn)

      obs('foo')

      instance.unsubscribe(obs, fn)

      obs.subscribe(() => done())

      obs('bar')
    })

    test('works when passed same accessor', (done) => {
      expect.assertions(1)

      const instance = new (Subscribable(EmptyClass))()
      const obs = ko.observable('')
      const accessor = () => obs()

      const fn = (v: any) => expect(v).toBe('foo')

      instance.subscribe(accessor, fn)

      obs('foo')

      instance.unsubscribe(accessor, fn)

      obs.subscribe(() => done())

      obs('bar')
    })

    test('works when passed same tree', (done) => {
      expect.assertions(1)

      const instance = new (Subscribable(EmptyClass))()
      const obs1 = ko.observable('')
      const obs2 = ko.observable('')
      const tree = { obs1, obs2 }

      const fn = (v: any) => expect(v.obs1).toBe('foo')

      instance.subscribe(tree, fn)

      obs1('foo')

      instance.unsubscribe(tree, fn)

      obs1.subscribe(() => done())

      obs1('bar')
    })

    test('works when passed subscription returned by this.subscribe()', (done) => {
      expect.assertions(1)

      const instance = new (Subscribable(EmptyClass))()
      const obs = ko.observable('')

      const sub = instance.subscribe(obs, (v) => expect(v).toBe('foo'))

      obs('foo')

      instance.unsubscribe(sub)

      obs.subscribe(() => done())

      obs('bar')
    })

    test('does not dispose all subscriptions for an observable', (done) => {
      expect.assertions(1)

      const instance = new (Subscribable(EmptyClass))()
      const obs = ko.observable('')
      const mock = jest.fn()
      const handler1 = () => mock()
      const handler2 = () => mock()

      instance.subscribe(obs, handler1)
      instance.subscribe(obs, handler2)

      obs('foo')

      instance.unsubscribe(obs, handler1)

      obs.subscribe(() => {
        expect(mock).toHaveBeenCalledTimes(3)
        done()
      })

      obs('bar')
    })
  })

  describe('.dispose()', () => {
    test('.dispose() disposes subscriptions', async () => {
      expect.assertions(1)

      const instance = new (Subscribable(EmptyClass))()
      const obs = ko.observable()

      instance.subscribe(obs, (newVal) => {
        expect(newVal).toBe('gucci')
      })

      obs('gucci')
      instance.dispose()
      obs('mane')
    })
  })
})
