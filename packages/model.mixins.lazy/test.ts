// tslint:disable max-classes-per-file

import * as ko from 'knockout'
import { DataModelConstructorBuilder } from '@profiscience/knockout-contrib-model-builders-data'

import { LazyMixin } from './index'

describe('model.mixins.lazy', () => {
  test('does not call fetch until specified property is accessed', (done) => {
    const FOOS = ['foo', 'bar', 'baz', 'qux']

    const spy = jest.fn()

    function FoosMixin<P, T extends { new(...args: any[]): DataModelConstructorBuilder<P> }>(ctor: T) {
      return class extends ctor {
        public foos: KnockoutObservableArray<string> = ko.observableArray([])
        protected async fetch(): Promise<any> {
          spy()
          return {
            foos: FOOS
          }
        }
      }
    }

    class DataModel extends DataModelConstructorBuilder
      .Mixin(FoosMixin)
      .Mixin(LazyMixin('foos'))
      <{}> {
    }

    const model = new DataModel({})

    expect(spy).not.toBeCalled()

    model.foos()
    model.foos()
    model.foos.subscribe((v) => {
      expect(spy).toHaveBeenCalledTimes(1)
      expect(v).toEqual(FOOS)

      model.foos = ko.observableArray()
      expect(model.foos()).toEqual([])

      done()
    })

  })
})
