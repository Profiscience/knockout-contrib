/* tslint:disable max-classes-per-file no-empty-interface */

import 'jest'
import * as ko from 'knockout'
import '@profiscience/knockout-contrib-jest-matchers'

import { ViewModelConstructorBuilder } from './ViewModelConstructorBuilder'

describe('DataModelConstructorBuilder', () => {
  test('uses SubscriptionDisposalMixin', () => {
    class FooModel extends ViewModelConstructorBuilder {
      public readonly value: KnockoutObservable<string>
    }

    const foo = new FooModel()

    expect(foo.subscribe).toBeDefined()
    expect(foo.dispose).toBeDefined()
  })
})
