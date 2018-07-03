// tslint:disable max-classes-per-file

import * as ko from 'knockout'
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'

import { TransformMixin } from './index'

const FOOS = ['foo', 'bar', 'baz', 'qux']

function reverse(arr: any[]) {
  // Array.prototype.reverse() modifies arrays in place b/c JS is stupid,
  // so clone and reverse the clone
  const tmp = [...arr]
  tmp.reverse()
  return tmp
}

function FoosMixin<
  P extends { page: number },
  T extends { new (...args: any[]): DataModelConstructorBuilder<P> }
>(ctor: T) {
  return class extends ctor {
    public foos = ko.observableArray()
    protected async fetch(): Promise<any> {
      return {
        foos: FOOS
      }
    }
  }
}
describe('model.mixins.transform', () => {
  test('transforms the response from mixed in fetch', async () => {
    const reverseFoos = (obj: any) => ({ ...obj, foos: reverse(obj.foos) })
    const ReverseFoosMixin = TransformMixin(reverseFoos) // tslint:disable-line variable-name
    class DataModel<P> extends DataModelConstructorBuilder.Mixin(
      FoosMixin
    ).Mixin(ReverseFoosMixin)<P> {}

    const model = await DataModel.create({})

    expect(ko.toJS(model.foos())).toEqual(reverse(FOOS))

    model.dispose()
  })

  test('transforms initData', async () => {
    const reverseFoos = (obj: any) => ({ ...obj, foos: reverse(obj.foos) })
    const ReverseFoosMixin = TransformMixin(reverseFoos) // tslint:disable-line variable-name
    class DataModel<P> extends DataModelConstructorBuilder.Mixin(
      ReverseFoosMixin
    )<P> {
      public foos = ko.observableArray()
    }

    const model = await DataModel.create({}, { foos: FOOS })

    expect(ko.toJS(model.foos())).toEqual(reverse(FOOS))

    model.dispose()
  })
})
