// tslint:disable max-classes-per-file

import * as ko from 'knockout'
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'

import { SpreadMixin } from './index'

function FoosMixin<
  P extends { page: number },
  T extends { new(...args: any[]): DataModelConstructorBuilder<P> }
>(ctor: T) {
  return class extends ctor {
    public foo: KnockoutObservable<string>
    public bar: KnockoutObservable<string>
    protected async fetch(): Promise<any> {
      return {
        foos: {
          foo: 'foo'
        },
        bar: 'bar'
      }
    }
  }
}

describe('model.mixins.spread', () => {
  test('spreads the properties of model[prop] onto the model', async () => {
    class DataModel<P> extends DataModelConstructorBuilder
      .Mixin(FoosMixin)
      .Mixin(SpreadMixin('foos'))<P> {
    }

    const model = await DataModel.create({})

    expect(ko.toJS(model.foo())).toEqual('foo')

    model.dispose()
  })

  test('deletes prop', async () => {
    class DataModel<P> extends DataModelConstructorBuilder
      .Mixin(FoosMixin)
      .Mixin(SpreadMixin('foos'))<P> {
    }

    const model = await DataModel.create({})

    expect(ko.toJS((model as any).foos)).toBeUndefined()

    model.dispose()
  })

  test('leaves other properties alone', async () => {
    class DataModel<P> extends DataModelConstructorBuilder
      .Mixin(FoosMixin)
      .Mixin(SpreadMixin('foos'))<P> {
    }

    const model = await DataModel.create({})

    expect(ko.toJS(model.bar())).toBe('bar')

    model.dispose()
  })
})
