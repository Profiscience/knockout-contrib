import * as ko from 'knockout'
import { SubscribableMixin as Subscribable } from '../SubscribableMixin'

class EmptyClass { }

describe('SubscribableMixin', () => {
  test('.subscribe(obs, fn) is equivalent to obs.subscribe(fn)', async () => {

    const instance = new (Subscribable(EmptyClass))()
    const obs = ko.observable()

    const p = new Promise((resolve) => instance.subscribe(obs, resolve))

    obs('gucci')

    expect(p).resolves.toBe('gucci')

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
