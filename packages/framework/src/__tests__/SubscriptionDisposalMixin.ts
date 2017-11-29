import * as ko from 'knockout'
import { SubscriptionDisposalMixin as Subscribable } from '../SubscriptionDisposalMixin'

class EmptyClass { }

describe('SubscribableMixin', () => {
  test('.subscribe(obs, fn) is equivalent to obs.subscribe(fn)', async () => {
    const instance = new (Subscribable(EmptyClass))()
    const obs = ko.observable() as KnockoutObservable<string>

    const p = new Promise((resolve) => instance.subscribe(obs,
      // check type safety
      (newval) => resolve(newval as string)))

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
        case 1: expect(newVal).toBe('gucci undefined'); break
        case 2: expect(newVal).toBe('gucci mane'); break
      }
    })

    obs1('gucci')
    obs2('mane')

    instance.dispose()
  })

  test('.subscribe() accepts an observable tree', async () => {
    expect.assertions(3)

    const instance = new (Subscribable(EmptyClass))()
    const obs1: KnockoutObservable<string> = ko.observable()
    const obs2: KnockoutObservable<string> = ko.observable()
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
