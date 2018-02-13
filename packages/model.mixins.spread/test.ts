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
        bar: {
          bar: 'bar'
        }
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

  test('can spread multiple properties', async () => {
    class DataModel<P> extends DataModelConstructorBuilder
      .Mixin(FoosMixin)
      .Mixin(SpreadMixin('foos'))
      .Mixin(SpreadMixin('bar'))
      <P> {
    }

    const model = await DataModel.create({})

    expect(model.foo()).toEqual('foo')
    expect(model.bar()).toEqual('bar')

    expect(model.toJS()).toEqual({
      foos: {
        foo: 'foo'
      },
      bar: {
        bar: 'bar'
      }
    })

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

    expect(ko.toJS(model.bar.bar())).toBe('bar')

    model.dispose()
  })

  test('patches .toJS()', async () => {
    class DataModel<P> extends DataModelConstructorBuilder
      .Mixin(FoosMixin)
      .Mixin(SpreadMixin('foos'))<P> {
    }

    const model = await DataModel.create({})

    model.foo('notfoo')

    expect(model.toJS()).toEqual({
      foos: {
        foo: 'notfoo'
      },
      bar: {
        bar: 'bar'
      }
    })

    model.dispose()
  })

  test('.toJS() patching works with init data', async () => {
    class DataModel<P> extends DataModelConstructorBuilder
      .Mixin(SpreadMixin('foos'))<P> {
      public foo: KnockoutObservable<string>
    }

    const model = await DataModel.create({}, {
      foos: {
        foo: 'foo'
      },
      bar: 'bar'
    })

    model.foo('notfoo')

    expect(model.toJS()).toEqual({
      foos: {
        foo: 'notfoo'
      },
      bar: 'bar'
    })

    model.dispose()
  })

  test('throws if attempting to spread array', async () => {
    function FoosArrMixin<
      P extends { page: number },
      T extends { new(...args: any[]): DataModelConstructorBuilder<P> }
    >(ctor: T) {
      return class extends ctor {
        public foo: KnockoutObservable<string>
        public bar: KnockoutObservable<string>
        protected async fetch(): Promise<any> {
          return {
            foos: [
              'foo'
            ],
            bar: 'bar'
          }
        }
      }
    }
    class DataModel<P> extends DataModelConstructorBuilder
      .Mixin(FoosArrMixin)
      .Mixin(SpreadMixin('foos'))<P> {
    }

    await expect(DataModel.create({})).rejects.toBeTruthy()
  })
})
